"use client";

import {
  motion,
  useAnimation,
  useInView,
  type MotionProps,
} from "framer-motion";
import { type PropsWithChildren, useEffect, useMemo, useRef } from "react";

type UseInViewOptions = Parameters<typeof useInView>[1];
type ViewportMargin = UseInViewOptions extends { margin?: infer M } ? M : never;

export type ScrollRevealProps = PropsWithChildren<{
  className?: string;
  baseOpacity?: number;
  baseOffset?: number;
  baseRotation?: number;
  enableBlur?: boolean;
  blurStrength?: number;
  viewportAmount?: number;
  viewportMargin?: ViewportMargin;
  transition?: MotionProps["transition"];
}>;

const defaultTransition: MotionProps["transition"] = {
  duration: 0.6,
  ease: [0.22, 0.61, 0.36, 1],
};

export default function ScrollReveal({
  children,
  className,
  baseOpacity = 0,
  baseOffset = 32,
  baseRotation = 0,
  enableBlur = false,
  blurStrength = 12,
  viewportAmount = 0.2,
  viewportMargin,
  transition,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const variants = useMemo(
    () => ({
      hidden: {
        opacity: baseOpacity,
        y: baseOffset,
        rotate: baseRotation,
        filter: enableBlur ? `blur(${blurStrength}px)` : undefined,
      },
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        filter: enableBlur ? "blur(0px)" : undefined,
      },
    }),
    [baseOpacity, baseOffset, baseRotation, enableBlur, blurStrength]
  );

  const inView = useInView(ref, {
    amount: viewportAmount,
    margin: viewportMargin,
  });

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={transition ?? defaultTransition}
    >
      {children}
    </motion.div>
  );
}
