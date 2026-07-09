"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";
import {
  LayoutDashboard,
  Search,
  Key,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn, getApiUrl, authFetch } from "@/lib/utils";
import type { User } from "@/types";

interface AppShellProps {
  user?: User;
  children: React.ReactNode;
}

export const UserContext = createContext<{
  user: User;
  refreshUser: () => Promise<void>;
} | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within AppShell");
  }
  return context;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
];

const settingsItems = [
  { href: "/settings/apify-key", label: "Apify Key", icon: Key },
];

export default function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);
  const [loading, setLoading] = useState(!user);

  async function refreshUser() {
    try {
      const res = await authFetch(getApiUrl("/api/auth/me"));
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      const token = localStorage.getItem("bf_session");
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const res = await authFetch(getApiUrl("/api/auth/me"));
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
          } else {
            localStorage.removeItem("bf_session");
            router.push("/auth");
          }
        } else {
          localStorage.removeItem("bf_session");
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [user, router]);

  async function handleLogout() {
    await authFetch(getApiUrl("/api/auth/logout"), { method: "POST" });
    localStorage.removeItem("bf_session");
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-bg-border">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
          <span className="text-bg-base font-bold text-sm font-display">B</span>
        </div>
        <span className="font-display font-bold text-lg text-white">
          Biz<span className="text-amber-500">Finder</span>
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
          Main
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-bg-hover"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-amber-500" />}
            </Link>
          );
        })}

        <p className="px-3 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 mt-4">
          Settings
        </p>
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-bg-hover"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {!currentUser.apifyKey && item.href === "/settings/apify-key" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User / Logout */}
      <div className="border-t border-bg-border p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-elevated mb-1">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-400 text-xs font-bold font-display">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <UserContext.Provider value={{ user: currentUser, refreshUser }}>
      <div className="flex h-screen bg-bg-base overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 flex-shrink-0 bg-bg-surface border-r border-bg-border flex-col">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 bg-bg-surface border-r border-bg-border">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-bg-border bg-bg-surface">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bg-hover transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-bold text-white">
              Biz<span className="text-amber-500">Finder</span>
            </span>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
