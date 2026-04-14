import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pink" | "success";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-2 text-muted border border-border",
    pink: "bg-pink/15 text-pink border border-pink/30",
    success: "bg-green/15 text-green border border-green/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded font-[family-name:var(--font-dm-sans)] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
