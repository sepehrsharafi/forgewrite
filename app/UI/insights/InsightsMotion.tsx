"use client";
import TypingAnimation from "@/components/magicui/typing-animation";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";

// Helper hook for media queries
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

interface InsightButtonProps {
  onClick: () => void;
  top: string;
  xlTop: string;
  left: string;
  xlLeft: string;
  translateY: string;
  xlTranslateY: string;
  svgWidth?: string;
  xlSvgWidth?: string;
}

const InsightButton = ({
  onClick,
  top,
  xlTop,
  left,
  xlLeft,
  translateY,
  xlTranslateY,
  svgWidth = "132px",
  xlSvgWidth = "13rem", // w-52
}: InsightButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isXl = useMediaQuery("(min-width: 1280px)");

  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: isXl ? xlTop : top,
    left: isXl ? xlLeft : left,
    borderTopRightRadius: "200rem",
  };

  const transformValue =
    isHovered || isActive
      ? `translateY(${isXl ? xlTranslateY : translateY})`
      : "translateY(0)";

  const svgStyle: React.CSSProperties = {
    transition: "transform 200ms",
    WebkitTransition: "transform 200ms", // For Safari
    width: isXl ? xlSvgWidth : svgWidth,
    overflow: "visible",
    transform: transformValue,
    WebkitTransform: transformValue, // For Safari
    pointerEvents: "none", // The SVG container itself shouldn't capture pointer events
  };

  const pathStyle: React.CSSProperties = {
    fill: isHovered || isActive ? "#629199" : "white",
    transition: "fill 200ms cubic-bezier(0, 0, 0.2, 1)",
    WebkitTransition: "fill 200ms cubic-bezier(0, 0, 0.2, 1)", // For Safari
    stroke: "#629199",
    strokeWidth: "3",
    cursor: "pointer",
    pointerEvents: "auto", // The path should be interactive
  };

  return (
    <div style={wrapperStyle}>
      <svg
        style={svgStyle}
        viewBox="0 0 208 578"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsActive(false);
          }}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          style={pathStyle}
          d="M86.3837 46.0959L2 3L3.74013 448.901L206 575L206 122.711L92.4731 65.6849L86.3837 46.0959Z"
        />
      </svg>
    </div>
  );
};

export default function InsightsMotion({ headers }: { headers?: string[] }) {
  const [selectedInsight, setSelectedInsight] = useState(0);
  const count = headers?.length ?? 0;
  const clampedIndex =
    count > 0 ? Math.min(Math.max(selectedInsight, 0), count - 1) : 0;
  const word = count > 0 ? headers![clampedIndex] : "-";

  useEffect(() => {
    if (!count) return;
    setSelectedInsight((i) => (i < 0 ? 0 : i > count - 1 ? count - 1 : i));
  }, [count]);
  return (
    <section className=" mx-auto">
      <div style={{ position: "relative", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            marginRight: "1.25rem",
          }}
        >
          <TypingAnimation
            className="text-base 2xl:text-xl"
            key={word || "typing"}
            style={{
              fontFamily: "'PT Sans', sans-serif",
              fontWeight: 700,
              color: "#629199",
            }}
            loop={false}
            words={[word]}
          />
        </div>
        <InsightButton
          onClick={() => setSelectedInsight(0)}
          top="8.75rem"
          xlTop="12.5rem"
          left="17.5rem"
          xlLeft="18.75rem"
          translateY="-2.5rem"
          xlTranslateY="-4.25rem"
        />
        <InsightButton
          onClick={() => setSelectedInsight(1)}
          top="9.5rem"
          xlTop="15rem"
          left="13rem"
          xlLeft="13.75rem"
          translateY="-2.5rem"
          xlTranslateY="-4.25rem"
        />
        <InsightButton
          onClick={() => setSelectedInsight(2)}
          top="10.5rem"
          xlTop="17.5rem"
          left="8.25rem"
          xlLeft="8.75rem"
          translateY="-2.5rem"
          xlTranslateY="-4.25rem"
        />
        <InsightButton
          onClick={() => setSelectedInsight(3)}
          top="11.25rem"
          xlTop="20rem"
          left="3.75rem"
          xlLeft="3.75rem"
          translateY="-2.5rem"
          xlTranslateY="-4.25rem"
        />
        <InsightButton
          onClick={() => setSelectedInsight(4)}
          top="12.5rem"
          xlTop="22.5rem"
          left="-0.5rem"
          xlLeft="-2.25rem"
          translateY="-2.5rem"
          xlTranslateY="-4.25rem"
        />
      </div>
    </section>
  );
}
