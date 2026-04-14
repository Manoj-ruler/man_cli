"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-muted font-[family-name:var(--font-dm-sans)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 bg-surface text-text border border-border rounded text-sm font-[family-name:var(--font-dm-sans)] placeholder:text-muted/50 transition-all duration-200 ease-out outline-none focus:border-pink focus:ring-2 focus:ring-pink/30 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-red focus:ring-red/30 focus:border-red" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
