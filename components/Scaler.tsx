"use client";
import { useEffect } from "react";

const DESIGN_WIDTH_MD = 1439;
const DESIGN_WIDTH_LG = 1910;

export default function Scaler() {
  useEffect(() => {
    const wrapper = document.getElementById("scaler-wrapper");
    if (wrapper) {
      const applyScale = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let designWidth = DESIGN_WIDTH_MD;
        if (screenWidth > DESIGN_WIDTH_LG) {
          designWidth = DESIGN_WIDTH_LG;
        }

        if (screenWidth > DESIGN_WIDTH_MD) {
          // Calculate the optimal height based on screen aspect ratio
          const screenAspectRatio = screenHeight / screenWidth;
          let contentHeight = 0;
          // Calculate content dimensions that maintain the width but adapt height to screen
          const contentWidth = designWidth;

          if (screenWidth > DESIGN_WIDTH_LG) {
            contentHeight = contentWidth * screenAspectRatio * 0.88; // 0.8 factor to leave some margin
          } else {
            contentHeight = contentWidth * screenAspectRatio * 0.87; // 0.8 factor to leave some margin}
          }

          // Calculate scale based on available space
          const widthScale = screenWidth / contentWidth;
          const heightScale = screenHeight / contentHeight;
          const scale = Math.min(widthScale, heightScale);

          wrapper.style.transform = `scale(${scale})`;
          wrapper.style.transformOrigin = "top left";
          wrapper.style.width = `${contentWidth}px`;
          wrapper.style.height = `${contentHeight}px`;
          wrapper.style.position = "relative";

          // Center the scaled content both horizontally and vertically
          const scaledWidth = contentWidth * scale;
          const scaledHeight = contentHeight * scale;
          wrapper.style.left = `${(screenWidth - scaledWidth) / 2}px`;
          wrapper.style.top = `${(screenHeight - scaledHeight) / 2}px`;
        } else {
          // Reset styles for screens <= 1440px
          wrapper.style.transform = "none";
          wrapper.style.width = "100%";
          wrapper.style.height = "100%";
          wrapper.style.position = "static";
          wrapper.style.left = "0";
          wrapper.style.top = "0";
        }
      };

      applyScale();
      window.addEventListener("resize", applyScale);
      return () => {
        window.removeEventListener("resize", applyScale);
        wrapper.style.transform = "none";
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.position = "static";
        wrapper.style.left = "0";
        wrapper.style.top = "0";
      };
    }
  }, []);
  return null;
}
