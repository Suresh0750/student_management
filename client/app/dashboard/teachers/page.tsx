"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/data-table";
import { useAuth } from "@/lib/auth/auth-context";
import { getUserRole } from "@/lib/auth/role";
import { IUser } from "@/lib/types";
import { ActionButton } from "@/components/common/ActionButton";
import Modal from "@/components/common/Modal";
import UserForm from "@/components/forms/UserForm";
import { addUserSchema, editUserSchema } from "@/lib/validation/users.schema";
import { ADD_FIELDS, EDIT_FIELDS } from "@/lib/shared/constants";
import useUsers from "@/hooks/useUsers";
import { toast } from "sonner";

export default function TeachersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editUser, setEditUser] = useState<IUser | null>(null)
  const {
    state: {
      users,
      isLoading,
      error
    },
    deleteUserApi,
    updateUserApi,
    createUserApi
  } = useUsers("TEACHER")
  const userRole = useMemo(() => getUserRole(user), [user]);

  const teacherColumns = useMemo(
    () =>
      [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
      ] as const,
    [],
  );

  const handleCloseModal = () => {
    if (isEdit) {
      setIsEdit(false)
    }
    if (editUser) {
      setEditUser(null)
    }
    setIsModalOpen(false)
  }
  const addTeacher = (data: any) => {
    console.log("teacher data", data)
    createUserApi.mutate({ ...data, role: "TEACHER" })
    handleCloseModal?.()
  }

  const updateTeacher = (data: any) => {
    if (!editUser) return
    updateUserApi.mutate({ id: editUser._id, body: { ...editUser, ...data } });
    handleCloseModal?.()
  };
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (userRole !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router, userRole]);

  function handleEdit(row: IUser) {
    console.log("Edit teacher:", row);
  }

  function handleDelete(row: IUser) {
    toast("Are you sure you want to delete?", {
      action: {
        label: "Yes",
        onClick: () => {
          const toastId = toast.loading("Deleting...");
          deleteUserApi.mutate(row._id);
          toast.success("Deleted", { id: toastId });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast("Cancelled");
        },
      },
    });
  }



  if (!isAuthenticated || userRole !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Teachers</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Admin-only teacher list.
      </p>
      <ActionButton label="Add Teacher" className="cursor-pointer" onClick={() => setIsModalOpen(true)} />

      <div className="mt-6">
        <DataTable<IUser>
          title="List Teachers"
          columns={[...teacherColumns]}
          rows={users}
          rowKey="_id"
          onEdit={(row) => {
            setIsEdit(true);
            setEditUser(row);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
      <Modal open={isModalOpen} title={isEdit ? "Edit New Teacher" : "Add New Teacher"} onClose={handleCloseModal}>
        <UserForm
          schema={isEdit ? editUserSchema : addUserSchema}
          fields={isEdit ? EDIT_FIELDS : ADD_FIELDS}
          onSubmit={isEdit ? updateTeacher : addTeacher}
          defaultValues={isEdit ? editUser : undefined}
        />
      </Modal>
    </div>
  );
}
