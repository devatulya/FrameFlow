import React from "react";
import { clsx } from "clsx";

interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "yellow" | "black";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    "font-grotesk font-bold uppercase tracking-wider transition-all duration-75 inline-flex items-center justify-center cursor-pointer select-none border-2 border-[#111111] shadow-[3px_3px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#111111] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_#111111]";

  const variantClasses = {
    primary: "bg-[#C41E24] text-white hover:bg-[#A0151A] border-[3px]",
    secondary: "bg-white text-[#111111] hover:bg-[#F5F2EB]",
    yellow: "bg-[#FFE800] text-[#111111] hover:bg-[#E6D000]",
    black: "bg-[#111111] text-white hover:bg-[#222222]",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs min-h-[36px]",
    md: "px-5 py-3 text-sm min-h-[48px]",
    lg: "px-6 py-4 text-base min-h-[56px]",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
