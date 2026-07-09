"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, User, Loader2, CheckCircle2 } from "lucide-react";
import { getApiUrl } from "@/lib/utils";

type Step = "register" | "otp";

export default function AuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  function startResendTimer() {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter your email");

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/send-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to send code");
      } else {
        setStep("otp");
        startResendTimer();
        setTimeout(() => otpRef.current?.focus(), 100);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) return setError("Enter the 6-digit code");

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: otp }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Invalid code");
      } else {
        router.push(data.user?.apifyKey ? "/dashboard" : "/settings/apify-key");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setError("");
    setOtp("");

    try {
      await fetch(getApiUrl("/api/auth/send-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      startResendTimer();
    } catch {
      setError("Failed to resend code");
    }
  }

  return (
    <div className="card-surface p-8 animate-fade-up">
      {step === "register" ? (
        <>
          <h2 className="font-display font-bold text-2xl text-white mb-1">
            Welcome
          </h2>
          <p className="text-slate-400 text-sm mb-7">
            Create an account or sign in to continue
          </p>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-bg-base font-semibold py-3 rounded-lg transition-all mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">Check your email</h2>
              <p className="text-slate-400 text-xs mt-0.5">Sent to {email}</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-6">
            Enter the 6-digit verification code we sent you.
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              ref={otpRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="otp-input"
              placeholder="000000"
            />

            {error && (
              <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-bg-base font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verify & Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              onClick={() => { setStep("register"); setOtp(""); setError(""); }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Change email
            </button>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-amber-400 hover:text-amber-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
