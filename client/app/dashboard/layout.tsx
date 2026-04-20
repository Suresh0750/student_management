"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { getUserRole, type AppRole } from "@/lib/auth/role";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const DASHBOARD = "/dashboard"

type SidebarItem = {
  label: string;
  path: string;
};

const getSidebarByRole = (role: AppRole): SidebarItem[] => {
  const sidebarConfig: Record<AppRole, SidebarItem[]> = {
    ADMIN: [
      { label: "Students", path: "/dashboard/students" },
      { label: "Teachers", path: "/dashboard/teachers" },
      { label: "Marks", path: "/dashboard/marks" }
    ],
    TEACHER: [{ label: "Subject", path: "/dashboard" }],
    STUDENT: [{ label: "Marks", path: "/dashboard" }],
  };

  return sidebarConfig[role] ?? [];
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, logout } = useAuth();
  const { user } = state;
  const [activeTab, setActiveTab] = useState("")
  const userName = useMemo(() => {
    if (!user || typeof user !== "object") return "Student";
    const maybeName = (user as { name?: unknown }).name;
    return typeof maybeName === "string" && maybeName.trim().length > 0
      ? maybeName
      : "Student";
  }, [user]);

  const userRole = useMemo(() => getUserRole(user), [user]);

  const sidebarItems = useMemo(
    () => (userRole ? getSidebarByRole(userRole) : []),
    [userRole]
  );

  function handleLogout() {
    toast("Are you sure you want to log out?", {
      action: {
        label: "Yes",
        onClick: () => logout(),
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
    });
  }

  const isActive = (activeBar: string) => {
    return activeBar == pathname ? "bg-zinc-900 text-white"
      : "text-zinc-700 hover:bg-zinc-100 hover:text-black"
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:grid md:grid-cols-[260px_1fr]">

      {/* Sidebar */}
      <aside className="border-b border-zinc-200 p-5 dark:border-zinc-800 md:border-b-0 md:border-r">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Dashboard</p>
          <h2 className="mt-1 text-lg font-semibold">{userName}</h2>
          <p className="text-sm text-zinc-500">{userRole ?? "UNKNOWN"}</p>
        </div>

        <nav className="space-y-2">
          <button className={`w-full rounded-md px-3 py-2 text-left text-sm ${isActive(DASHBOARD)}`} onClick={() => router.push(DASHBOARD)}>
            Overview
          </button>

          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full rounded-md px-3 py-2 cursor-pointer text-left text-sm hover:bg-zinc-100 ${isActive(item.path)}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-md border px-3 py-2 text-sm hover:bg-zinc-100 cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Page Content */}
      <section className="p-6 md:p-8">{children}</section>
    </div>
  );
}