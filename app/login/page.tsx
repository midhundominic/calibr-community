"use client";

import React from "react";
import { Linkedin, Users, ArrowRight } from "lucide-react";
import { signInWithLinkedIn } from "@/lib/supabase";
import Link from "next/link";
import PublicLayout from "@/app/components/Layout/PublicLayout";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function LoginPage() {
  const returnTo = "/community";

  const handleLinkedInLogin = async () => {
    try {
    
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

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Join The Future of Learning Community
              </h1>
              <p className="text-gray-600">
                Connect with L&D professionals and Instructional Designers
                worldwide
              </p>
            </div>

            {/* LinkedIn Login Button */}
            <button
              onClick={handleLinkedInLogin}
              className="w-full flex items-center justify-center px-6 py-4 bg-[#0077B5] text-white font-semibold rounded-lg hover:bg-[#005885] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Linkedin className="w-5 h-5 mr-3" />
              Continue with LinkedIn
              <ArrowRight className="w-5 h-5 ml-3" />
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                What you'll get:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Participate in expert discussions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Network with industry professionals
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Share insights and best practices
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Powered by{" "}
              <a
                href="https://calibr.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Calibr.AI
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
