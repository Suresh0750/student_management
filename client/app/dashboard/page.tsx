"use client";

import { useAuth } from "@/lib/auth/auth-context";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <h1 className="text-2xl font-semibold">
        Welcome to Dashboard
      </h1>

      <p className="mt-2 text-sm text-zinc-600">
        Manage users, reports, and settings from the sidebar.
      </p>

      <div className="mt-6 border border-dashed p-5">
        {isAuthenticated && user ? (
          <p>
            You are logged in.
          </p>
        ) : (
          <p>Session not found. Please login again.</p>
        )}
      </div>
    </>
  );
}