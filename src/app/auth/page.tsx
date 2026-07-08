import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default async function AuthPage() {
  const user = await getSession();
  if (user) redirect("/dashboard");

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
