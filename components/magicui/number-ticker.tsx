"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_DURATION = 1500;

export type NumberTickerProps = {
  value: number | string;
  format?: (value: number) => string;
  duration?: number;
  startValue?: number;
  className?: string;
};

export function NumberTicker({
  value,
  format,
  duration = DEFAULT_DURATION,
  startValue,
  className,
}: NumberTickerProps) {
  const numericTarget = useMemo(() => {
    if (typeof value === "number") return value;
    const numberFromString = Number(String(value).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(numberFromString) ? numberFromString : 0;
  }, [value]);

  const template = useMemo(() => {
    if (typeof value !== "string") return null;
    const match = value.match(/[0-9][0-9.,]*/);
    if (!match || match.index === undefined) return null;
    const digits = match[0].replace(/[^0-9]/g, "").length;
    return {
      prefix: value.slice(0, match.index),
      suffix: value.slice(match.index + match[0].length),
      digits,
      grouping: match[0].includes(","),
    };
  }, [value]);

  const previousTargetRef = useRef<number | null>(null);
  const start = useMemo(() => {
    if (typeof startValue === "number") return startValue;
    return previousTargetRef.current ?? numericTarget;
  }, [numericTarget, startValue]);

  const motionValue = useMotionValue(start);
  const [displayValue, setDisplayValue] = useState(start);

  useEffect(() => {
    motionValue.set(start);
    setDisplayValue(start);

    const controls = animate(motionValue, numericTarget, {
      duration: Math.max(0.1, duration / 1000),
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest),
    });

    return () => controls.stop();
  }, [duration, motionValue, numericTarget, start]);

  useEffect(() => {
    previousTargetRef.current = numericTarget;
  }, [numericTarget]);

  const formatted = useMemo(() => {
    const rounded = Math.floor(displayValue + 0.0001);
    if (format) {
      return format(rounded);
    }

    if (template) {
      const formatter = new Intl.NumberFormat("en-US", {
        minimumIntegerDigits: template.digits || undefined,
        useGrouping: template.grouping,
      });
      return `${template.prefix}${formatter.format(rounded)}${template.suffix}`;
    }

    return rounded.toLocaleString();
  }, [displayValue, format, template]);

  return (
    <span className={className} data-number-ticker>
      {formatted}
    </span>
  );
}

export default NumberTicker;
