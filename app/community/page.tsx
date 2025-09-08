'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase";

export default function CommunityPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to Community 🎉</h1>
        <p className="mb-4">Hello {user?.email}</p>
        <button
          onClick={signOut}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
