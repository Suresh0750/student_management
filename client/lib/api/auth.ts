import { API_URL } from "../shared/utils";
import { apiJson } from "./client";

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResult = {
  success?: boolean;
  user?: Record<string, unknown>;
  token?: string;
  message?: string;
  [key: string]: unknown;
};

export function loginRequest(body: LoginBody): Promise<LoginResult> {
  return apiJson<LoginResult>(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}


