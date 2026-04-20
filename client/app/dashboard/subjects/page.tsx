"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/data-table";
import { useAuth } from "@/lib/auth/auth-context";
import { getUserRole } from "@/lib/auth/role";
import { IMarks, IUser } from "@/lib/types";
import { ActionButton } from "@/components/common/ActionButton";
import UserForm from "@/components/forms/UserForm";
import Modal from "@/components/common/Modal";
import { ADD_STUDENT_FIELDS, EDIT_STUDENT_FIELDS, getStudentFields } from "@/lib/shared/utils";
import { addStudentSchema, editStudentSchema } from "@/lib/validation/users.schema";
import useUsers from "@/hooks/useUsers";
import { useMarks } from "@/hooks/useMarks";
import { toast } from "sonner";

export default function MarksPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [editMarks, setEditMarks] = useState<IMarks | null>(null)

    const userRole = useMemo(() => getUserRole(user), [user]);

    const {
        state: {
            users,
            isLoading,
            error
        },
        deleteUserApi,
        updateUserApi,
        createUserApi
    } = useUsers("STUDENT")
    const { createMarks, updateMarks, deleteMarks, marks, isLoading: isMarkLoading, isError: isMarkError, studentMarks, isStudentMarksLoading, isCreating: isMarkCreating, isUpdating: isMarkUpdating, isDeleting: isMarkDeleting } = useMarks()

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
    const removeAddedUsers = (users: IUser[], marks: IMarks[]) => {
        return users?.filter((user) => !marks?.some((mark) => mark.studentId === user._id))
    }

    const fields = getStudentFields(removeAddedUsers(users ?? [], marks ?? []), "name", isEdit);

    useEffect(() => {
        console.log("users subject", users)
    }, [users])

    const handleCloseModal = () => {
        if (isEdit) {
            setIsEdit(false)
        }
        if (editMarks) {
            setEditMarks(null)
        }
        setIsModalOpen(false)
    }

    const addSubject = (data: any) => {
        console.log("students data", data)
        const { user, ...rest } = data
        const payload = {
            studentId: user?._id,
            ...rest,
        }
        createMarks(payload)
        // createUserApi.mutate({ ...data, role: "STUDENT" })
        handleCloseModal?.()
    }

    const updateSubject = (data: any) => {
        const markId = editMarks?._id;
        if (!markId) return;

        updateMarks({ markId: markId, body: data }); // ✅ pass as a single object
        handleCloseModal?.();
    };
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (userRole === "ADMIN") {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, router, userRole]);

    function handleEdit(row: IMarks) {
        setIsEdit(true);
        setEditMarks({
            ...row,
            user: row.name
        } as IMarks);
        setIsModalOpen(true);
    }
    function handleDelete(row: IMarks) {
        console.log("Delete student:", row);
        const marksId = row?._id
        if (!marksId) return
        toast("Are you sure you want to delete?", {
            action: {
                label: "Yes",
                onClick: () => {
                    const toastId = toast.loading("Deleting...");

                    deleteMarks(marksId)
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

    if (!isAuthenticated || userRole === "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-7rem)] rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Students Marks</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Teachers-only student marks list.
            </p>
            <ActionButton label="Add Marks" className="cursor-pointer" onClick={() => setIsModalOpen(true)} />

            <div className="mt-6">
                <DataTable<IMarks>
                    title="List Students Marks"
                    columns={[...studentColumns]}
                    rows={marks as IMarks[]}
                    rowKey="_id"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={false}
                />
            </div>
            <Modal open={isModalOpen} title={isEdit ? "Edit Student Marks" : "Add Student Marks"} onClose={handleCloseModal}>
                <UserForm
                    schema={isEdit ? editStudentSchema : addStudentSchema}
                    fields={fields}
                    onSubmit={isEdit ? updateSubject : addSubject}
                    defaultValues={isEdit ? editMarks : undefined}
                />
            </Modal>
        </div>
    );
}
