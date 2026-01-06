"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getAuthToken, clearAuth, isTokenExpired } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = getAuthToken();
  const logoutMutation = useMutation(api.auth.logout);

  const sessionValid = useQuery(
    api.auth.checkSession,
    token && !isTokenExpired() ? { token } : "skip"
  );

  useEffect(() => {
    if (!token || isTokenExpired() || sessionValid?.valid === false) {
      clearAuth();
      router.push("/login");
    }
  }, [token, sessionValid, router]);

  const handleLogout = async () => {
    if (token) {
      await logoutMutation({ token });
    }
    clearAuth();
    router.push("/login");
  };

  if (sessionValid === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">
              Affiliate Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
