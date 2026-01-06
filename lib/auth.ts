export const ADMIN_CREDENTIALS = {
  email: "admin@yoursite.com",
  password: "your-secure-password-123",
};

export const setAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authTime", Date.now().toString());
  }
};

export const checkAuth = (): boolean => {
  if (typeof window === "undefined") return false;

  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const authTime = localStorage.getItem("authTime");

  if (isAuth && authTime) {
    const daysSinceAuth =
      (Date.now() - parseInt(authTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceAuth > 7) {
      logout();
      return false;
    }
  }

  return isAuth;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTime");
  }
};

export const validateCredentials = (
  email: string,
  password: string
): boolean => {
  return (
    email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
  );
};
