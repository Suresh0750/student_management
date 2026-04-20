import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllMarksRequest,
    getMarksByStudentRequest,
    createMarks,
    updateMarks,
    deleteMarks,
} from "@/lib/api/marks";
import { IMarks } from "@/lib/types";


export const MARKS_KEY = "marks";

type UseMarksOptions = {
    studentId?: string;
};

export const useMarks = ({ studentId }: UseMarksOptions = {}) => {
    const queryClient = useQueryClient();

    const allMarks = useQuery({
        queryKey: [MARKS_KEY],
        queryFn: getAllMarksRequest,
    });

    const studentMarks = useQuery({
        queryKey: [MARKS_KEY, studentId],
        queryFn: () => getMarksByStudentRequest(studentId!),
        enabled: !!studentId,
    });

    const createMutation = useMutation({
        mutationFn: createMarks,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [MARKS_KEY] }),
    });

    const updateMutation = useMutation({
        mutationFn: updateMarks,
        onSuccess: (response) => {
            const updatedMark = response.marks; // ✅ unwrap from response

            queryClient.setQueryData<IMarks[]>([MARKS_KEY], (prev) =>
                prev
                    ? prev.map((mark) =>
                        mark._id === updatedMark._id ? updatedMark : mark
                    )
                    : []
            );
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deleteMarks,
        onSuccess: (_, markId) => { // markId = the variable passed to mutate()
            queryClient.setQueryData<IMarks[]>([MARKS_KEY], (prev) =>
                prev ? prev.filter((mark) => mark._id !== markId) : []
            );
        },
    });


    return {
        // Queries
        marks: allMarks.data as IMarks[],
        isLoading: allMarks.isLoading,
        isError: allMarks.isError,

        studentMarks: studentMarks.data,
        isStudentMarksLoading: studentMarks.isLoading,

        // Mutations
        createMarks: createMutation.mutate,
        updateMarks: updateMutation.mutate,
        deleteMarks: deleteMutation.mutate,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};