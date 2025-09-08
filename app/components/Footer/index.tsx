import React from "react";
import Link from "next/link";
import { ExternalLink, Mail, Linkedin, Twitter } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              The Future of Learning
            </h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Connecting L&D professionals and Instructional Designers to shape
              the future of corporate learning.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  About the Community
                </Link>
              </li>
              <li>
                <Link
                  href="/benefits"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Powered by Calibr.AI</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Calibr.AI is building the future of learning technology for
              enterprises.
            </p>
            <Link
              href="https://calibr.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors text-sm sm:text-base"
            >
              Visit Calibr.AI
              <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm">&copy; 2024 Calibr.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
