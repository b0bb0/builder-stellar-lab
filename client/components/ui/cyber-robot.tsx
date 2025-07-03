import React from "react";
import { cn } from "@/lib/utils";

interface CyberRobotProps {
  isWaving?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CyberRobot({
  isWaving = true,
  size = "md",
  className,
}: CyberRobotProps) {
  const sizeClasses = {
    sm: "scale-40",
    md: "scale-60",
    lg: "scale-80",
  };

  return (
    <div
      className={cn("relative", sizeClasses[size], className)}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Robot Container */}
      <div
        className="relative"
        style={{
          transform: "rotateX(10deg) rotateY(-5deg)",
          transformStyle: "preserve-3d",
          animation: "robot-float 3s ease-in-out infinite",
        }}
      >
        {/* Shadow */}
        <div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-18 h-3 bg-black/30 rounded-full blur-sm"
          style={{
            animation: "shadow-pulse 3s ease-in-out infinite",
          }}
        />

        {/* Robot Body */}
        <div className="relative">
          {/* Head - Large and bulbous like reference */}
          <div
            className="relative w-20 h-18 mx-auto mb-1 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100"
            style={{
              transform: "translateZ(12px) scale(1, 1.15)",
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.1)",
              border: "2px solid rgba(220,220,220,0.9)",
            }}
          >
            {/* Dark Visor - Very large like reference */}
            <div
              className="absolute top-1 left-1 right-1 bottom-2 rounded-full bg-gray-900 border-2 border-gray-800 overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #2a2a2a, #000000)",
                boxShadow:
                  "inset 0 0 25px rgba(0,255,255,0.3), 0 0 15px rgba(0,0,0,0.9)",
              }}
            >
              {/* Glowing Cyan Eyes - Larger and more prominent */}
              <div
                className="absolute top-4 left-3 w-3 h-3 rounded-full bg-cyber-cyan"
                style={{
                  boxShadow:
                    "0 0 12px rgba(0,255,255,1), inset 0 0 6px rgba(0,255,255,0.5)",
                  animation: "eye-glow 2s ease-in-out infinite",
                }}
              />
              <div
                className="absolute top-4 right-3 w-3 h-3 rounded-full bg-cyber-cyan"
                style={{
                  boxShadow:
                    "0 0 12px rgba(0,255,255,1), inset 0 0 6px rgba(0,255,255,0.5)",
                  animation: "eye-glow 2s ease-in-out infinite",
                  animationDelay: "0.1s",
                }}
              />

              {/* Subtle mouth line */}
              <div
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-0.5 rounded bg-cyber-cyan/30"
                style={{
                  boxShadow: "0 0 4px rgba(0,255,255,0.3)",
                }}
              />
            </div>

            {/* Antennae - Thinner and more elegant */}
            <div className="absolute -top-1 left-4 w-0.5 h-4 bg-gray-500 rounded-full transform rotate-12" />
            <div className="absolute -top-1 right-4 w-0.5 h-4 bg-gray-500 rounded-full transform -rotate-12" />
            <div
              className="absolute -top-2 left-4 w-1.5 h-1.5 rounded-full bg-cyan-400 transform rotate-12"
              style={{
                boxShadow: "0 0 6px rgba(0,255,255,0.8)",
                animation: "antenna-glow 3s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -top-2 right-4 w-1.5 h-1.5 rounded-full bg-cyan-400 transform -rotate-12"
              style={{
                boxShadow: "0 0 6px rgba(0,255,255,0.8)",
                animation: "antenna-glow 3s ease-in-out infinite",
                animationDelay: "1.5s",
              }}
            />
          </div>

          {/* Body - Compact and almost same width as head */}
          <div
            className="relative w-18 h-16 mx-auto rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100"
            style={{
              transform: "translateZ(10px) scale(1, 1.2)",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.1)",
              border: "2px solid rgba(220,220,220,0.9)",
            }}
          >
            {/* Chest Panel - Large circular panel like reference */}
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-600"
              style={{
                boxShadow:
                  "inset 0 0 15px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              {/* Inner Circle with Cyber Logo */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-cyber-cyan bg-gray-900"
                style={{
                  boxShadow:
                    "0 0 10px rgba(0,255,255,0.6), inset 0 0 6px rgba(0,255,255,0.2)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-cyber-cyan font-bold">
                  ©
                </div>
              </div>
            </div>

            {/* Body Panels - Small details */}
            <div
              className="absolute top-16 left-3 w-2 h-2 rounded-full bg-gray-600"
              style={{ boxShadow: "inset 0 0 2px rgba(0,0,0,0.5)" }}
            />
            <div
              className="absolute top-16 right-3 w-2 h-2 rounded-full bg-gray-600"
              style={{ boxShadow: "inset 0 0 2px rgba(0,0,0,0.5)" }}
            />
          </div>

          {/* Left Arm - Very stubby like reference */}
          <div
            className={cn(
              "absolute top-20 -left-6 w-4 h-6 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-150 border border-gray-300",
              isWaving && "origin-top",
            )}
            style={{
              transform: "translateZ(6px)",
              animation: isWaving
                ? "wave-arm 1.5s ease-in-out infinite"
                : "none",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Hand - Round like little mittens */}
            <div
              className="absolute -bottom-1 -left-1 w-6 h-4 rounded-full bg-gradient-to-b from-gray-50 to-gray-200 border border-gray-300"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            />
          </div>

          {/* Right Arm */}
          <div
            className="absolute top-20 -right-6 w-4 h-6 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-150 border border-gray-300"
            style={{
              transform: "translateZ(6px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Hand */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-4 rounded-full bg-gradient-to-b from-gray-50 to-gray-200 border border-gray-300"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            />
          </div>

          {/* Legs - Very short and stubby like reference */}
          <div
            className="absolute top-32 left-6 w-4 h-5 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-150 border border-gray-300"
            style={{
              transform: "translateZ(7px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Foot - Cute little boots */}
            <div
              className="absolute -bottom-1 -left-1 w-6 h-3 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            />
          </div>

          <div
            className="absolute top-32 right-6 w-4 h-5 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-150 border border-gray-300"
            style={{
              transform: "translateZ(7px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Foot */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-3 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400"
              style={{
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
