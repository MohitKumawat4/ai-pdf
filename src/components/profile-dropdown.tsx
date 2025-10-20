"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Briefcase,
  LayoutTemplate,
  LogOut,
  Sparkles,
  ChevronDown
} from "lucide-react";

/**
 * Profile Dropdown Component
 * Interactive dropdown for user profile with statistics and quick actions
 */
type ProfileDropdownProps = {
  displayName: string;
  userEmail: string;
  initials: string;
  userSince: string;
  resumeCount: number;
};

export function ProfileDropdown({
  displayName,
  userEmail,
  initials,
  userSince,
  resumeCount,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 ${
          isOpen ? "bg-white/15 border-white/40" : ""
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-semibold text-white shadow-lg">
          {initials || "U"}
        </span>
        <span className="flex flex-col text-left">
          <span className="text-sm font-semibold leading-tight">{displayName}</span>
          <span className="text-[11px] text-muted-foreground leading-tight">{userEmail}</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/20 bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a] backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />

            {/* Header with user info */}
            <div className="relative p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-lg font-bold text-white shadow-lg ring-2 ring-white/20">
                  {initials || "U"}
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-white">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  {userSince && (
                    <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Member since {userSince}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="relative p-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-4 backdrop-blur-sm">
                <FileText className="h-5 w-5 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">{resumeCount}</p>
                <p className="text-xs text-muted-foreground">Resumes Created</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 backdrop-blur-sm">
                <Briefcase className="h-5 w-5 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-xs text-muted-foreground">Templates Available</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="relative p-4 space-y-2">
              <Link href="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-start gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" size="sm">
                  <Sparkles className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/saved-resumes" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-3 border-white/20 hover:bg-white/10" size="sm">
                  <FileText className="h-4 w-4" />
                  My Resumes
                </Button>
              </Link>
              <Link href="/templates" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-3 border-white/20 hover:bg-white/10" size="sm">
                  <LayoutTemplate className="h-4 w-4" />
                  Browse Templates
                </Button>
              </Link>
            </div>

            {/* Footer Actions */}
            <div className="relative p-4 pt-0 border-t border-white/10 mt-2">
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
