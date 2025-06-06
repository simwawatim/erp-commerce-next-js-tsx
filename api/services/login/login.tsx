import axiosInstance from "../base-url";

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  role: string;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("api/auth/login/", {
    username,
    password,
  });

  const { access, refresh, username: returnedUsername, role } = response.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("username", returnedUsername);
  localStorage.setItem("role", role);

  return response.data;
};
