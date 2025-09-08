import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
  onJoinClick?: () => void;
}

export default function PublicLayout({
  children,
  onJoinClick,
}: PublicLayoutProps) {
  const router = useRouter();
  const handleJoinClick =
    onJoinClick ||
    (() => {
      router.push("/login");
    });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onJoinClick={handleJoinClick} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
