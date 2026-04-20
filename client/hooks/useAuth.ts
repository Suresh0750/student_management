import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginRequest, type LoginResult } from "@/lib/api/auth";
import { useAuth as useAuthContext, type AuthUser } from "@/lib/auth/auth-context";

const useAuth = () => {
    const router = useRouter();
    const { setSession, user, token, isAuthenticated, logout: contextLogout } = useAuthContext();

    const loginApi = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            const result = data as LoginResult;
            const maybeUser = ((result.user && typeof result.user === "object")
                ? result.user
                : result) as AuthUser;
            if (result.token) {
                localStorage.setItem("token", result.token);
            }
            console.log("after login", maybeUser)
            setSession({
                user: maybeUser,
                token: result.token,
            });
            router.push("/dashboard");
            router.refresh();
            toast.success(result.message || "Login successful");
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        },
    });

    const logout = () => {
        contextLogout();
        localStorage.removeItem("token");
        router.push("/login");
        router.refresh();
    };

    return {
        state: {
            user,
            token,
            isAuthenticated,
        },
        loginApi,
        logout,
        setSession,
    };
};

export default useAuth;
