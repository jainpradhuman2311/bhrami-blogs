"use client";

import { useEffect } from "react";

export default function HideShootingStars() {
  useEffect(() => {
    // Hide shooting stars on blog detail pages
    // Find all fixed divs with z-[1] that contain shooting stars
    const hideShootingStars = () => {
      const allDivs = document.querySelectorAll('div[class*="fixed"][class*="z-[1]"]');
      allDivs.forEach((div) => {
        const html = div.innerHTML;
        // Check if this div contains shooting star elements (has animation with "shoot-" prefix)
        if (html.includes('shoot-') || html.includes('animation')) {
          (div as HTMLElement).style.display = 'none';
        }
      });
    };

    // Run immediately and after a short delay to catch dynamically rendered elements
    hideShootingStars();
    const timeout = setTimeout(hideShootingStars, 100);

    return () => {
      clearTimeout(timeout);
      // Show shooting stars again when leaving the page
      const allDivs = document.querySelectorAll('div[class*="fixed"][class*="z-[1]"]');
      allDivs.forEach((div) => {
        (div as HTMLElement).style.display = '';
      });
    };
  }, []);

  return null;
}

