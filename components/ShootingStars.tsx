"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  endX: number;
  endY: number;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Generate random shooting stars
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * 360;
        const radians = (angle * Math.PI) / 180;
        const distance = 500 + Math.random() * 300;
        const endX = Math.cos(radians) * distance;
        const endY = Math.sin(radians) * distance;
        
        newStars.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 6,
          duration: 1.5 + Math.random() * 2.5,
          endX,
          endY,
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 8000); // Regenerate every 8 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted || stars.length === 0) return;

    // Inject CSS for each star's animation
    const styleId = 'shooting-stars-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const keyframes = stars.map((star) => {
      const endXHalf = star.endX * 0.5;
      const endYHalf = star.endY * 0.5;
      return `
        @keyframes shoot-${star.id} {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(${endXHalf}px, ${endYHalf}px) scale(1.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(${star.endX}px, ${star.endY}px) scale(0);
            opacity: 0;
          }
        }
      `;
    }).join('\n');

    styleElement.textContent = keyframes;

    return () => {
      // Clean up on unmount
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [stars, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '2px',
            height: '2px',
            boxShadow: "0 0 10px 4px rgba(255, 255, 255, 1), 0 0 20px 8px rgba(255, 255, 255, 0.8), 0 0 30px 12px rgba(255, 255, 255, 0.5)",
            animation: `shoot-${star.id} ${star.duration}s ${star.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
