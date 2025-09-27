"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";

const BASE_HEIGHT = 384; // Tailwind h-96
const BOTTOM_OFFSET = 24; // breathing room so we do not pin to the viewport edge

const Motion = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(BASE_HEIGHT);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeHeight = (rect?: DOMRect) => {
      const node = containerRef.current;
      if (!node) return;

      const viewportHeight = window.innerHeight || BASE_HEIGHT;
      const box = rect ?? node.getBoundingClientRect();

      if (box.bottom <= 0 || box.top >= viewportHeight) return;

      const available = viewportHeight - Math.max(box.top, 0) - BOTTOM_OFFSET;
      const next = Math.min(BASE_HEIGHT, Math.max(available, 0));

      setHeight((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
    };

    const handleResize = () => {
      computeHeight();
    };

    // Run once on mount so the container adapts immediately.
    computeHeight();

    window.addEventListener("resize", handleResize);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              computeHeight(entry.boundingClientRect);
            }
          });
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const clampStyle =
    height < BASE_HEIGHT ? { height: `${height}px` } : undefined;

  return (
    <div
      ref={containerRef}
      className={`border-b-2 xl:border-0 border-[#646464] mx-auto h-[300px] min-h-[300px] w-full xl:w-[355px] xl:min-w-[355px] xl:max-w-[355px] relative xl:h-full overflow-hidden ${className}`}
      style={clampStyle}
    >
      {children}
    </div>
  );
};

export default Motion;
