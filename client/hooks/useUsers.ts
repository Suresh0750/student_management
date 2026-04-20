import { ApiResponse, createUsers, getUsersRequest, updateUsers, deleteUser } from "@/lib/api/users";
import { IUser } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const useUsers = () => {

  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersRequest,
  });
  const createUserApi = useMutation<ApiResponse<IUser>, Error, IUser>({
    mutationFn: createUsers,
    onSuccess: (data) => {
      const result = data;
      const { user = null } = result
      if (user) {
        queryClient.setQueryData<IUser[]>(["users"], (oldUsers = []) => {
          const exists = oldUsers.some((u) => u._id === user._id);
          if (exists) return oldUsers;
          return [...oldUsers, user];
        });
      }
      console.log(result, "create users")
      const message = result.message || "data created successfully"
      toast.success(message)
      //   handleCloseModal?.()
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });
  // mutation definition
  const updateUserApi = useMutation<ApiResponse<IUser>, Error, { id: string; body: IUser }>({
    mutationFn: updateUsers,
    onSuccess: (data) => {
      const { user = null, message } = data;
      if (user) {
        queryClient.setQueryData<IUser[]>(["users"], (oldUsers = []) => {
          // ⚠️ Fix: update existing user instead of skipping if exists
          return oldUsers.map((u) => (u._id === user._id ? user : u));
        });
      }
      toast.success(message || "User updated successfully");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  const deleteUserApi = useMutation<ApiResponse<IUser>, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (data, deletedUserId) => {
      queryClient.setQueryData<IUser[]>(["users"], (oldUsers = []) => {
        return oldUsers.filter((u) => u._id !== deletedUserId);
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });
  return {
    state: {
      users,
      isLoading,
      error
    },
    updateUserApi,
    createUserApi,
    deleteUserApi
  }

}

export default useUsers