"use client";

import { useAuth } from "@/hooks/useAuth";
import { signInWithLinkedIn } from "@/lib/supabase";
import { ExternalLink, Linkedin, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface HeaderProps {
  onJoinClick?: () => void;
}

export default function Header({ onJoinClick }: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const handleLinkedInSignIn = async () => {
    try {
      console.log("Header LinkedIn sign in clicked");
      await signInWithLinkedIn();
    } catch (error: any) {
      console.error("Login error:", error);

      // More specific error messages
      if (error.message?.includes("Invalid login credentials")) {
        toast.error(
          "LinkedIn authentication failed. Please check your LinkedIn app configuration."
        );
      } else if (error.message?.includes("redirect_uri")) {
        toast.error(
          "Redirect URI mismatch. Please check your LinkedIn app settings."
        );
      } else if (error.message?.includes("client_id")) {
        toast.error(
          "LinkedIn Client ID not configured. Please check your environment variables."
        );
      } else {
        toast.error(
          `Authentication error: ${error.message || "Please try again."}`
        );
      }
    }
  };

  // Determine the correct home link based on authentication status and current location
  const getHomeLink = () => {
    if (isAuthenticated) {
      return "/community";
    }
    // If on a community page but not authenticated, go to landing page
    if (pathname.startsWith("/community/")) {
      return "/";
    }
    return "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href={getHomeLink()}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  The Future of Learning
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  L&D Community
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <a
              href="https://calibr.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <span>Powered by Calibr.AI</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {isAuthenticated ? (
              <Link
                href="/community"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">Go to Community</span>
                <span className="sm:hidden">Community</span>
              </Link>
            ) : (
              <button
                onClick={handleLinkedInSignIn}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-[#0077B5] text-white font-medium rounded-lg hover:bg-[#005885] transition-colors text-sm sm:text-base whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                <Linkedin className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign in with LinkedIn</span>
                <span className="sm:hidden">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
