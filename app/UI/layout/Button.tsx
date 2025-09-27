import React from "react";

interface ButtonProps {
  bgColor?: string;
  size: "s" | "m" | "x" | "xl";
  width?: string;
  active: boolean;
  children?: React.ReactNode;
  padding?: string;
  onClick?: () => void;
  border?: { width: string; color: string };
  className?: string;
}

export default function Button({
  bgColor = "232733",
  size,
  width,
  active,
  children,
  padding,
  onClick,
  border,
  className,
}: ButtonProps) {
  const sizeClass = {
    s: `text-xs ${padding ? `${padding}` : `px-3 py-2`}`,
    m: `text-sm ${padding ? `${padding}` : `px-3 py-2.5`}`,
    x: `text-base ${padding ? `${padding}` : `px-6 py-3`}`,
    xl: `text-base ${padding ? `${padding}` : `px-8 py-4`}`,
  };

  const baseClasses =
    "transition-all duration-200 font-medium rounded-sm text-nowrap text-white";

  const stateClasses = active
    ? "bg-[#4D838C]"
    : `bg-[#${bgColor}] hover:bg-[#4D838C] active:bg-[#999FB6]`;

  const widthClass = width ? `w-${width}` : "w-full sm:w-auto";

  const hasBorder = border
    ? `border-[${border.width}px] border-[#${border.color}]`
    : ``;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${sizeClass[size]} ${widthClass} h-fit ${hasBorder} ${className}`}
    >
      {children}
    </button>
  );
}
