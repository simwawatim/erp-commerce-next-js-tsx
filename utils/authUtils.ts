export const getUserRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};

export const getUsername = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username");
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_id");
  }
  return null;
};
