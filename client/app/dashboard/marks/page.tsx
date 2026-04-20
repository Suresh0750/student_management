"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/data-table";
import { useAuth } from "@/lib/auth/auth-context";
import { getUserRole } from "@/lib/auth/role";
import { IUser } from "@/lib/types";

export default function MarksPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const userRole = useMemo(() => getUserRole(user), [user]);

  const studentColumns = useMemo(
    () =>
      [
        { key: "name", header: "Name" },
        { key: "tamil", header: "Tamil" },
        { key: "english", header: "English" },
        { key: "maths", header: "Maths" },
        { key: "physics", header: "Physics" },
        { key: "chemistry", header: "Chemistry" },
      ] as const,
    [],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (userRole === "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router, userRole]);

  function handleEdit(row: IUser) {
    console.log("Edit student:", row);
  }

  function handleDelete(row: IUser) {
    console.log("Delete student:", row);
  }

  if (!isAuthenticated || userRole === "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Students Marks</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Teachers-only student marks list.
      </p>

      <div className="mt-6">
        <DataTable<IUser>
          title="List Students Marks"
          columns={[...studentColumns]}
          rows={[] as IUser[]}
          rowKey="_id"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
