"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Users, LogOut, User, Bell, Settings, Search as SearchIcon, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CommunityHeaderProps {
  onMenuClick: () => void;
}

export default function CommunityHeader({ onMenuClick }: CommunityHeaderProps) {
  const { profile } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [open]);



  useEffect(() => {
    if (open && !searchQuery) {
      fetchTrending();
    }
  }, [open]);

  const fetchTrending = async () => {
    const { data, error } = await supabase
      .from("threads")
      .select("id, title, slug, last_activity_at, category:categories(id, name, slug, color)")
      .order("last_activity_at", { ascending: false })
      .limit(6);

    if (!error && data) setTrending(data);
  };


  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("threads")
        .select("id, title, slug, last_activity_at, category:categories(id, name, slug, color)")
        .ilike("title", `%${searchQuery}%`)
        .limit(12);

      if (!error && data) {
        setResults(data);
      } else {
        setResults([]);
      }
      setLoading(false);
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      const items = searchQuery ? results : trending;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      }
      if (e.key === "Enter") {
        const selected = items[activeIndex];
        if (selected) {
          router.push(`/community/category/${selected.category?.slug}/${selected.slug}`);
          setOpen(false);
          setSearchQuery("");
        }
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex, searchQuery, results, trending]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/community"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  The Future of Learning
                </h1>
                <p className="text-sm text-gray-500">Community</p>
              </div>
            </Link>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <div
              className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-text"
              onClick={() => {
                setOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            >
              <SearchIcon className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-gray-400">Search for discussion</span>
            </div>

            {open && (
              <div
                ref={popupRef}
                className="absolute top-12 left-0 right-0 bg-white border rounded-xl shadow-xl z-50 w-full max-w-4xl mx-auto"
              >
                <div className="p-3 border-b">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 text-black focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
                  {loading ? (
                    <div className="p-4 text-gray-500">Searching...</div>
                  ) : searchQuery ? (
                    results.length > 0 ? (
                      <ul>
                        {results.map((thread, i) => (
                          <li
                            key={thread.id}
                            className={`px-4 py-3 cursor-pointer text-gray-900 ${
                              i === activeIndex ? "bg-indigo-50" : "hover:bg-gray-50"
                            }`}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => {
                              router.push(`/community/category/${thread.category?.slug}/${thread.slug}`);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{thread.title}</span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(thread.last_activity_at)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <Link
                                href={`/community/category/${thread.category?.slug}`}
                                style={{ color: thread.category?.color }}
                                className="hover:underline"
                              >
                                {thread.category?.name}
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-gray-500">No results found</div>
                    )
                  ) : (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-900">
                        Trending Posts
                      </div>
                      <ul>
                        {trending.map((thread, i) => (
                          <li
                            key={thread.id}
                            className={`px-4 py-3 cursor-pointer text-gray-900 ${
                              i === activeIndex ? "bg-indigo-50" : "hover:bg-gray-50"
                            }`}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => {
                              router.push(`/community/category/${thread.category?.slug}/${thread.slug}`);
                              setOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{thread.title}</span>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(thread.last_activity_at)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <Link
                                href={`/community/category/${thread.category?.slug}`}
                                style={{ color: thread.category?.color }}
                                className="hover:underline"
                              >
                                {thread.category?.name}
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-900">
                  {profile?.full_name || "User"}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link> */}
                  {/* <hr className="my-1" /> */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
