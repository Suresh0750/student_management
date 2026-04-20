"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { loginRequest, type LoginResult } from "@/lib/api/auth";
import { useAuth, type AuthUser } from "@/lib/auth/auth-context";
import { validateLogin, type LoginFormValues } from "@/lib/validation/login";

const inputBaseClass =
  "h-11 w-full rounded-lg border bg-white px-3 text-zinc-900 outline-none ring-zinc-400/20 transition-[box-shadow,border-color] placeholder:text-zinc-400 focus:ring-4 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-500/20";
const inputOkClass =
  "border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500";
const inputErrClass =
  "border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500";

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});

  const login = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const result = data as LoginResult;
      const maybeUser = ((result.user && typeof result.user === "object")
        ? result.user
        : result) as AuthUser;
        if(result.token){
          localStorage.setItem("token",result.token)
        }
      setSession({
        user: maybeUser,
        token: result.token,
      });
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      const message = 
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login.reset();
    const data = new FormData(e.currentTarget);
    const raw: LoginFormValues = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };
    const result = validateLogin(raw);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      return;
    }
    setFieldErrors({});
    login.mutate(result.value);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          onChange={() =>
            setFieldErrors((prev) => ({ ...prev, email: undefined }))
          }
          className={`${inputBaseClass} ${fieldErrors.email ? inputErrClass : inputOkClass}`}
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-sm text-red-600 dark:text-red-400">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          onChange={() =>
            setFieldErrors((prev) => ({ ...prev, password: undefined }))
          }
          className={`${inputBaseClass} ${fieldErrors.password ? inputErrClass : inputOkClass}`}
        />
        {fieldErrors.password ? (
          <p
            id="password-error"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {fieldErrors.password}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={login.isPending}
        className="mt-1 flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {login.isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
