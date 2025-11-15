"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Beam {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
}

interface Collision {
  x: number;
  y: number;
  id: number;
}

export default function BackgroundBeams({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [beams, setBeams] = useState<Beam[]>([]);
  const [collisions, setCollisions] = useState<Collision[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize beams
    const initialBeams: Beam[] = [];
    const beamCount = 12;

    for (let i = 0; i < beamCount; i++) {
      initialBeams.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        angle: Math.random() * 360,
        speed: 0.03 + Math.random() * 0.04,
        length: 150 + Math.random() * 200,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }

    setBeams(initialBeams);

    // Animation loop
    const animate = () => {
      setBeams((prevBeams) => {
        const newBeams = prevBeams.map((beam) => {
          const radians = (beam.angle * Math.PI) / 180;
          let newX = beam.x + Math.cos(radians) * beam.speed;
          let newY = beam.y + Math.sin(radians) * beam.speed;

          // Wrap around edges
          if (newX < -10) newX = 110;
          if (newX > 110) newX = -10;
          if (newY < -10) newY = 110;
          if (newY > 110) newY = -10;

          return {
            ...beam,
            x: newX,
            y: newY,
          };
        });

        // Check for collisions
        const newCollisions: Collision[] = [];
        for (let i = 0; i < newBeams.length; i++) {
          for (let j = i + 1; j < newBeams.length; j++) {
            const beam1 = newBeams[i];
            const beam2 = newBeams[j];
            const dx = beam1.x - beam2.x;
            const dy = beam1.y - beam2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 8) {
              newCollisions.push({
                x: (beam1.x + beam2.x) / 2,
                y: (beam1.y + beam2.y) / 2,
                id: Date.now() + Math.random() * 1000,
              });
            }
          }
        }

        if (newCollisions.length > 0) {
          setCollisions((prev) => [...prev, ...newCollisions].slice(-15));
        }

        return newBeams;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Remove collisions after animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCollisions((prev) => prev.slice(1));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 pointer-events-none overflow-hidden z-[1]", className)}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {beams.map((beam) => {
          const radians = (beam.angle * Math.PI) / 180;
          const endX = beam.x + Math.cos(radians) * (beam.length / 10);
          const endY = beam.y + Math.sin(radians) * (beam.length / 10);

          return (
            <motion.line
              key={beam.id}
              x1={beam.x}
              y1={beam.y}
              x2={endX}
              y2={endY}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.15"
              opacity={beam.opacity}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* Collision explosions */}
      {collisions.map((collision) => (
        <motion.div
          key={collision.id}
          className="absolute"
          style={{
            left: `${collision.x}%`,
            top: `${collision.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 2, 4], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="w-32 h-32 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-white/50 blur-xl" />
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-white/70 blur-md" />
        </motion.div>
      ))}
    </div>
  );
}

