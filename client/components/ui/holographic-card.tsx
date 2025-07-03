import React from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "critical" | "warning" | "success";
  glowIntensity?: "low" | "medium" | "high";
  children: React.ReactNode;
}

const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
  (
    {
      className,
      variant = "default",
      glowIntensity = "medium",
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      default:
        "from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20 border-cyber-cyan/40",
      critical:
        "from-red-500/30 via-red-400/20 to-pink-500/30 border-red-400/60",
      warning:
        "from-yellow-500/30 via-orange-400/20 to-red-500/30 border-yellow-400/60",
      success:
        "from-green-500/30 via-emerald-400/20 to-cyan-500/30 border-green-400/60",
    };

    const glowStyles = {
      low: "shadow-[0_0_20px_rgba(0,255,255,0.1)]",
      medium: "shadow-[0_0_40px_rgba(0,255,255,0.2)]",
      high: "shadow-[0_0_60px_rgba(0,255,255,0.4)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl p-6 backdrop-blur-md transition-all duration-500 hover:scale-[1.02]",
          "bg-gradient-to-br",
          variantStyles[variant],
          glowStyles[glowIntensity],
          "border border-opacity-40",
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
          "after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-t after:from-transparent after:via-white/5 after:to-white/10 after:opacity-50",
          className,
        )}
        style={{
          background: `
            linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(255,0,255,0.1) 50%, rgba(0,255,255,0.1) 100%),
            linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)
          `,
          backgroundSize: "200% 200%, 100% 100%",
          animation: "holographic-shift 8s ease-in-out infinite",
        }}
        {...props}
      >
        <div className="relative z-10">{children}</div>

        {/* Holographic shimmer effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-30"
          style={{
            background: `
              linear-gradient(
                45deg,
                transparent 30%,
                rgba(255,255,255,0.2) 40%,
                rgba(0,255,255,0.3) 50%,
                rgba(255,0,255,0.3) 60%,
                rgba(255,255,255,0.2) 70%,
                transparent 80%
              )
            `,
            backgroundSize: "200% 200%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />
      </div>
    );
  },
);

HolographicCard.displayName = "HolographicCard";

export { HolographicCard };
