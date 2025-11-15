"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const GlowingBorder = ({
  children,
  className,
  size = 200,
  borderWidth = 2,
  borderColor = "#ffffff",
  glowColor = "#ffffff",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  glowColor?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative group", className)}
      {...props}
    >
      {/* Glowing background effect */}
      <div
        className="absolute -inset-[2px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(${size}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}15, transparent 40%)`,
          filter: "blur(20px)",
        }}
      />
      
      {/* Border glow effect */}
      <div
        className="absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(${size}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${borderColor}30, transparent 50%)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: `${borderWidth}px`,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative rounded-[inherit] border border-gray-700/50 group-hover:border-gray-500/70 transition-colors duration-300 h-full">
        {children}
      </div>
    </div>
  );
};

