"use client";

import { useCallback, useRef } from "react";

export function useThemeTransition() {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const animateThemeChange = useCallback((callback: () => void) => {
    // Create overlay if it doesn't exist
    if (!overlayRef.current) {
      const overlay = document.createElement("div");
      overlay.className = "theme-transition-overlay";
      overlay.style.backgroundColor = "var(--background)";
      document.body.appendChild(overlay);
      overlayRef.current = overlay;
    }

    const overlay = overlayRef.current;
    document.body.classList.add("theme-transitioning");

    // Trigger animation
    overlay.classList.add("active");

    // Execute theme change at the peak of animation
    setTimeout(() => {
      callback();
    }, 300);

    // Clean up after animation completes
    setTimeout(() => {
      overlay.classList.remove("active");
      document.body.classList.remove("theme-transitioning");
    }, 600);
  }, []);

  return { animateThemeChange };
}
