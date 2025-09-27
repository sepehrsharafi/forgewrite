"use client";
import React, { useState, useEffect } from "react";

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
  const [percentage, setPercentage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const duration = 2500;
    let startTime: number | null = null;

    const easeInOutExpo = (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
      return (2 - Math.pow(2, -20 * t + 10)) / 2;
    };

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeInOutExpo(progress);

      setPercentage(Math.round(easedProgress * 100));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (percentage === 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1000); // 1-second delay after reaching 100%

      return () => clearTimeout(timer);
    }
  }, [percentage]);

  const handleTransitionEnd = () => {
    if (isFadingOut) {
      onClose();
    }
  };

  return (
    <section
      className={`fixed w-full h-full -m-4 xl:-m-0 p-4 xl:p-15  flex items-center justify-center z-[999] bg-white transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="flex flex-col justify-center items-center gap-7 2xl:gap-10 w-full h-full border-2 border-[#646464]">
        <span className="text-7xl xl:text-9xl text-[#999FB6] font-bold font-['PT_Sans']">
          {percentage}%
        </span>
        <div className="w-3/5 xl:w-2/5 h-1.5 overflow-clip rounded-full bg-[#EBEBEB]">
          <span
            className="bg-[#4D4E69] h-full block"
            style={{ width: `${percentage}%` }}
          ></span>
        </div>
      </div>
    </section>
  );
}
