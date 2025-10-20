"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/ui/shimmer-button";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export function Navigation() {
  const { user, loading } = useAuth();
  const [resumeCount, setResumeCount] = useState(0);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Fetch resume count when user changes
  useEffect(() => {
    let isActive = true;

    if (!user) {
      setResumeCount(0);
      return () => {
        isActive = false;
      };
    }

    const fetchResumeCount = async () => {
      setLoadingResumes(true);
      try {
        const supabase = createClient();
        const { data: resumes } = await supabase
          .from("resumes")
          .select("id")
          .eq("user_id", user.id);

        if (isActive) {
          setResumeCount(resumes?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching resume count:", error);
        if (isActive) {
          setResumeCount(0);
        }
      } finally {
        if (isActive) {
          setLoadingResumes(false);
        }
      }
    };

    fetchResumeCount();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (loading) {
    return (
      <nav className="relative z-50 border-b border-cyan-500/20 bg-black/40 backdrop-blur-2xl shadow-lg shadow-cyan-500/5 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <Image src="/logo.png" alt="ResumePersona" width={32} height={32} className="h-8 w-8 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">ResumePersona</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors">How It Works</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-zinc-800 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="relative z-50 border-b border-cyan-500/20 bg-black/40 backdrop-blur-2xl shadow-lg shadow-cyan-500/5 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <Image src="/logo.png" alt="ResumePersona" width={32} height={32} className="h-8 w-8 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">ResumePersona</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <ProfileDropdown
                displayName={user.user_metadata?.full_name?.trim() || user.email?.split("@")[0] || "Your Profile"}
                userEmail={user.email || ""}
                initials={
                  (user.user_metadata?.full_name?.trim() || user.email?.split("@")[0] || "Your Profile")
                    .split(" ")
                    .filter(Boolean)
                    .map((segment: string) => segment[0]?.toUpperCase() ?? "")
                    .join("")
                    .slice(0, 2)
                }
                userSince={user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ""}
                resumeCount={resumeCount}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <ShimmerButton className="h-9 px-4 text-sm">
                    Get Started
                  </ShimmerButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
