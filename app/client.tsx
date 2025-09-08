'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Home=()=> {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.push(isAuthenticated ? "/community" : "/login");
    }
  }, [isAuthenticated, loading, router]);

  return <p className="p-4">Loading...</p>;
}

export default Home;
