import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Shimmer Button Component
 * A button with an animated shimmer effect that travels around the perimeter
 */
export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "2px",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--border-width": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white [border-radius:var(--radius)] transition-all duration-300 hover:scale-105",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Background layer - behind everything */}
        <div
          className={cn(
            "absolute inset-0 -z-10 [background:var(--bg)] [border-radius:var(--radius)]"
          )}
        />

        {/* Border shimmer container - behind content but above background */}
        <div
          className={cn(
            "absolute inset-0 -z-[5] overflow-hidden [border-radius:var(--radius)]"
          )}
        >
          {/* Rotating shimmer gradient - continuous infinite loop */}
          <div className="animate-spin-around absolute inset-[-100%] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>

        {/* Inner background to create border effect */}
        <div
          className={cn(
            "absolute inset-[var(--border-width)] -z-[3] [background:var(--bg)] [border-radius:calc(var(--radius)-var(--border-width))]"
          )}
        />

        {/* Content - on top with relative positioning */}
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

        {/* Subtle highlight on hover */}
        <div
          className={cn(
            "absolute inset-0 z-[1] pointer-events-none",
            "rounded-[var(--radius)] shadow-[inset_0_-8px_10px_#ffffff0f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff1f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff2f]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
