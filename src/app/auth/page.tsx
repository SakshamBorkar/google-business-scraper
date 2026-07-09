"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bf_session");
    if (token) {
      router.push("/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg-base bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
            <span className="text-bg-base font-bold font-display">B</span>
          </div>
          <span className="font-display font-bold text-xl text-white">
            Biz<span className="text-amber-500">Finder</span>
          </span>
        </div>

        <AuthForm />
      </div>
    </main>
  );
}
