"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  BarChart2,
  Code2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  userEmail?: string;
  onSignOut?: () => void;
}

const navItems = [
  { href: "/dashboard/commands", label: "Commands", icon: BarChart2 },
  { href: "/dashboard/snippets", label: "Snippets", icon: Code2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({
  userEmail = "user@example.com",
  onSignOut,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-5 py-5">
        <Terminal className="w-5 h-5 text-pink" />
        <span className="text-lg font-bold text-text font-[family-name:var(--font-syne)] tracking-tight">
          term<span className="text-pink">assist</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-200 ${
                    isActive
                      ? "text-pink bg-pink/10 border-l-2 border-pink"
                      : "text-muted hover:text-text hover:bg-surface-2 border-l-2 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded bg-pink/20 flex items-center justify-center text-pink text-xs font-bold">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2 w-full mt-1 text-sm text-muted hover:text-red transition-colors duration-200 cursor-pointer rounded hover:bg-surface-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded text-muted hover:text-text transition-colors cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-bg border-r border-border h-screen fixed left-0 top-0">
        {sidebarContent}
      </aside>

      {/* Sidebar — Mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 w-64 bg-bg border-r border-border h-screen flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
