"use client";

import { signInWithLinkedIn } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/community");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-xl font-bold text-center">Sign in</h1>
        <button
          onClick={() => signInWithLinkedIn()}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in with LinkedIn
        </button>
      </div>
    </div>
  );
}