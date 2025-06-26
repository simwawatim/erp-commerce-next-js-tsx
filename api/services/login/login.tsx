import axiosInstance from "../base-url";

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  role: string;
}

function decodeJWT(token: string): any {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
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

  const decodedToken = decodeJWT(access);
  const userId = decodedToken.user_id;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("username", returnedUsername);
  localStorage.setItem("role", role);
  localStorage.setItem("user_id", userId);

  return response.data;
};
