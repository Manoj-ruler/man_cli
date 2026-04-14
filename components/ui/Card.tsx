import React from "react";

interface CardProps {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export function Card({ children, glow = false, className = "" }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded p-6 transition-all duration-200 ease-out ${
        glow ? "card-glow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
