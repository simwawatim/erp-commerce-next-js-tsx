
export const getUserRole = (): string | null => {
  return localStorage.getItem("role");
};

export const getUsername = (): string | null => {
  return localStorage.getItem("username");
};

export const getUserId = (): string | null => {
  return localStorage.getItem("user_id");
};

