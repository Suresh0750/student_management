import { API_URL } from "../shared/utils";
import { IMarks } from "../types";
import { apiJson } from "./client";
import { ApiResponse } from "./users"; // reuse existing types


// ── API Functions ─────────────────────────────────────────────────────────────

export async function getAllMarksRequest(): Promise<IMarks[]> {
    const res = await apiJson<ApiResponse<IMarks[]>>(`${API_URL}/marks`);
    return res.marks;
}

export async function getMarksByStudentRequest(studentId: string): Promise<IMarks> {
    const res = await apiJson<ApiResponse<IMarks>>(`${API_URL}/marks/${studentId}`);
    return res.marks;
}

export async function createMarks(body: Omit<IMarks, "_id" | "createdAt" | "updatedAt">): Promise<ApiResponse<IMarks>> {
    return apiJson<ApiResponse<IMarks>>(`${API_URL}/marks`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function updateMarks({
    markId,
    body,
}: {
    markId: string;
    body: Omit<IMarks, "_id" | "student" | "createdAt" | "updatedAt">;
}): Promise<ApiResponse<IMarks>> {
    return apiJson<ApiResponse<IMarks>>(`${API_URL}/marks/${markId}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteMarks(studentId: string): Promise<ApiResponse<IMarks>> {
    return apiJson<ApiResponse<IMarks>>(`${API_URL}/marks/${studentId}`, {
        method: "DELETE",
    });
}