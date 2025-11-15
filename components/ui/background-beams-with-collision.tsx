"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left -
            parentRect.left +
            beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected]);

  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  const beamRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black p-20",
        className
      )}
    >
      <div
        ref={containerRef}
        className="absolute inset-x-0 top-0 m-auto h-px w-px"
      />
      <Beam
        ref={beamRef}
        containerRef={containerRef}
        parentRef={parentRef}
        beamOptions={{
          initialX: 0,
          translateX: 0,
          initialY: "-200px",
          translateY: "1800px",
          rotate: 0,
          className: "",
          duration: 8,
          delay: 0,
          repeatDelay: 0,
        }}
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{
            x: span.initialX,
            y: span.initialY,
            opacity: 1,
          }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 1.5 + 0.5,
            ease: "easeOut",
          }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
        />
      ))}
      {collision.detected && collision.coordinates && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute z-50 h-2 w-2"
          style={{
            left: `${collision.coordinates.x}px`,
            top: `${collision.coordinates.y}px`,
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 4], opacity: [1, 0.5, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
          />
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface BeamProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  beamOptions?: {
    initialX?: number;
    translateX?: number;
    initialY?: string;
    translateY?: string;
    rotate?: number;
    className?: string;
    duration?: number;
    delay?: number;
    repeatDelay?: number;
  };
}

const Beam = React.forwardRef<HTMLDivElement, BeamProps>(
  ({ containerRef, parentRef, beamOptions }, ref) => {
    const {
      initialX = 0,
      translateX = 0,
      initialY = "-200px",
      translateY = "1800px",
      rotate = 0,
      className = "",
      duration = 8,
      delay = 0,
      repeatDelay = 0,
    } = beamOptions || {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          "absolute z-50 h-2 w-2",
          className
        )}
        initial={{
          x: initialX,
          y: initialY,
          opacity: 1,
        }}
        animate={{
          x: translateX,
          y: translateY,
          opacity: 0,
        }}
        transition={{
          duration,
          delay,
          repeatDelay,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
          style={{
            transform: `rotate(${rotate}deg)`,
          }}
        />
      </motion.div>
    );
  }
);

Beam.displayName = "Beam";
