import { API_URL } from "../shared/utils";
import { IUser } from "../types";
import { apiJson } from "./client";
import { useQuery } from "@tanstack/react-query";

export type UserRecord = {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type ApiResponseBase = {
  success: boolean;
  message: string;
};
export type ApiResponse<T> = ApiResponseBase & {
  [key: string] : T
};

export async function getUsersRequest(): Promise<IUser[]> {
  const res = await apiJson<ApiResponse<IUser[]>>(`${API_URL}/user/get`);
  return res.data;
}


export async function createUsers(body:IUser):  Promise<ApiResponse<IUser>>{
  return apiJson<ApiResponse<IUser>>(`${API_URL}/user/create`, {
    method: "POST",
    body: JSON.stringify(body),
  });
 ;
}

// api function
export async function updateUsers({ id, body }: { id: string; body: IUser }): Promise<ApiResponse<IUser>> {
  return apiJson<ApiResponse<IUser>>(`${API_URL}/user/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id: string): Promise<ApiResponse<IUser>> {
  return apiJson<ApiResponse<IUser>>(`${API_URL}/user/delete/${id}`, {
    method: "DELETE",
  });
}