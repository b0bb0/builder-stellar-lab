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
    sm: "scale-50",
    md: "scale-75",
    lg: "scale-100",
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
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full blur-sm"
          style={{
            animation: "shadow-pulse 3s ease-in-out infinite",
          }}
        />

        {/* Robot Body */}
        <div className="relative">
          {/* Head */}
          <div
            className="relative w-12 h-12 mx-auto mb-1 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 border border-gray-400"
            style={{
              transform: "translateZ(10px)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {/* Face Screen */}
            <div
              className="absolute inset-1 rounded-xl bg-gray-900 border border-cyber-cyan/50 overflow-hidden"
              style={{
                boxShadow: "inset 0 0 10px rgba(0,255,255,0.3)",
              }}
            >
              {/* Eyes */}
              <div
                className="absolute top-3 left-2 w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"
                style={{
                  boxShadow: "0 0 6px rgba(0,255,255,0.8)",
                }}
              />
              <div
                className="absolute top-3 right-2 w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"
                style={{
                  boxShadow: "0 0 6px rgba(0,255,255,0.8)",
                  animationDelay: "0.1s",
                }}
              />

              {/* Mouth */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded bg-cyber-cyan/50" />
            </div>

            {/* Antennae */}
            <div className="absolute -top-2 left-3 w-0.5 h-3 bg-gray-400 rounded-full" />
            <div className="absolute -top-2 right-3 w-0.5 h-3 bg-gray-400 rounded-full" />
            <div className="absolute -top-3 left-3 w-1 h-1 rounded-full bg-cyber-cyan animate-pulse" />
            <div className="absolute -top-3 right-3 w-1 h-1 rounded-full bg-cyber-cyan animate-pulse" />
          </div>

          {/* Body */}
          <div
            className="relative w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-gray-100 to-gray-300 border border-gray-400"
            style={{
              transform: "translateZ(8px)",
              boxShadow:
                "0 6px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {/* Chest Panel */}
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-xl bg-gray-800 border border-cyber-cyan/50"
              style={{
                boxShadow: "inset 0 0 8px rgba(0,255,255,0.2)",
              }}
            >
              {/* Cyber Logo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-cyber-cyan rounded bg-cyber-cyan/10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-cyber-cyan font-bold">
                  ©
                </div>
              </div>
            </div>

            {/* Body Details */}
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded bg-cyber-purple/50" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded bg-cyber-purple/50" />
          </div>

          {/* Left Arm */}
          <div
            className={cn(
              "absolute top-12 -left-5 w-3 h-8 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-500",
              isWaving && "origin-top",
            )}
            style={{
              transform: "translateZ(5px)",
              animation: isWaving
                ? "wave-arm 1.5s ease-in-out infinite"
                : "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Hand */}
            <div
              className="absolute -bottom-1 -left-0.5 w-4 h-3 rounded bg-gray-300 border border-gray-500"
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Right Arm */}
          <div
            className="absolute top-12 -right-5 w-3 h-8 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-500"
            style={{
              transform: "translateZ(5px)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Hand */}
            <div
              className="absolute -bottom-1 -right-0.5 w-4 h-3 rounded bg-gray-300 border border-gray-500"
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Legs */}
          <div
            className="absolute top-24 left-3 w-3 h-6 rounded-b-full bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-500"
            style={{
              transform: "translateZ(6px)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Foot */}
            <div
              className="absolute -bottom-1 -left-1 w-5 h-2 rounded bg-gray-400 border border-gray-600"
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          <div
            className="absolute top-24 right-3 w-3 h-6 rounded-b-full bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-500"
            style={{
              transform: "translateZ(6px)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Foot */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-2 rounded bg-gray-400 border border-gray-600"
              style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
