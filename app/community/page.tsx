"use client";

// import AuthGuard from "@/components/auth/AuthGuard";
// import CommunityHome from "@/components/CommunityHome";
import CommunityHeader from "@/app/components/Layout/CommunityHeader";
// import Sidebar from "@/components/Layout/Sidebar";
import React, { useState } from "react";

export default function CommunityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // <AuthGuard>
    <div className="min-h-screen bg-gray-50 pt-16">
      <CommunityHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

        <main className="flex-1 lg:ml-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* <CommunityHome /> */}
          </div>
        </main>
      </div>
    </div>
    // </AuthGuard>
  );
}
