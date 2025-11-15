"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function TracingBeam({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full max-w-4xl mx-auto h-full", className)}
    >
      <div className="absolute -left-2 sm:-left-4 md:-left-20 top-0">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          className="ml-[11px] sm:ml-[19px] md:ml-[27px] h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-white/20 shadow-sm flex items-center justify-center bg-white/5 backdrop-blur-sm"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full border border-white/30 bg-white/80"
          />
        </motion.div>
        {svgHeight > 0 && (
          <svg
            className="absolute left-[17px] sm:left-[25px] md:left-[33px] top-3 sm:top-4 block"
            width="2"
            height={svgHeight}
            viewBox={`0 0 2 ${svgHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M 1 0V ${svgHeight}`}
              className="stroke-white/20"
              strokeWidth="2"
            />
            <motion.path
              d={`M 1 0V ${svgHeight}`}
              stroke="url(#gradient)"
              strokeWidth="2"
              className="shadow-lg shadow-white/10"
              initial={{ pathLength: 0 }}
              style={{ pathLength: scrollYProgress }}
            />
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#ffffff" stopOpacity="0" />
              <stop stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
          </svg>
        )}
      </div>
      <motion.div ref={contentRef}>{children}</motion.div>
    </motion.div>
  );
}

