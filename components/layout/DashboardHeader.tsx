import React from "react";

interface DashboardHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, children }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border bg-bg/50 backdrop-blur-sm">
      <h1 className="text-xl font-bold text-text font-[family-name:var(--font-syne)]">
        {title}
      </h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
