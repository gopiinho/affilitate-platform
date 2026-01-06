export const setAuthToken = (token: string, expiresAt: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authExpiry", expiresAt.toString());
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authExpiry");
  }
};

export const isTokenExpired = (): boolean => {
  if (typeof window === "undefined") return true;

  const expiry = localStorage.getItem("authExpiry");
  if (!expiry) return true;

  return Date.now() > parseInt(expiry);
};
