"use client";

import { useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

type AnimateFn = ReturnType<typeof useAnimate>[1];
type AnimationOptions = NonNullable<Parameters<AnimateFn>[2]>;

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

type DebouncedFunction<T extends (...args: unknown[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  wait = 0,
  { leading = false, trailing = true }: DebounceOptions = {}
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let leadingInvoked = false;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;

    if (leading && !timer && !leadingInvoked) {
      callback(...args);
      leadingInvoked = true;
      lastArgs = null;
    }

    clearTimer();

    timer = setTimeout(() => {
      if (trailing && lastArgs) {
        callback(...lastArgs);
      }

      leadingInvoked = false;
      lastArgs = null;
      timer = null;
    }, wait);
  }) as DebouncedFunction<T>;

  debounced.cancel = () => {
    clearTimer();
    leadingInvoked = false;
    lastArgs = null;
  };

  return debounced;
}

interface TextProps {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptions;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  className?: string;
  onClick?: () => void;
}

export function LetterSwapForward({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.5,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);

  const hoverStart = () => {
    if (blocked) return;

    setBlocked(true);

    // Function to merge user transition with stagger and delay
    const mergeTransition = (baseTransition?: AnimationOptions) => ({
      ...(baseTransition ?? {}),
      delay: stagger(staggerDuration, {
        from: staggerFrom,
      }),
    });

    animate(
      ".letter",
      { y: reverse ? "100%" : "-100%" },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter",
        {
          y: 0,
        },
        {
          duration: 0,
        }
      ).then(() => {
        setBlocked(false);
      });
    });

    animate(
      ".letter-secondary",
      {
        top: "0%",
      },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        {
          duration: 0,
        }
      );
    });
  };

  return (
    <span
      className={`flex justify-center items-center relative overflow-hidden ${className}`}
      onMouseEnter={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary"
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export function LetterSwapPingPong({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate();
  const [isHovered, setIsHovered] = useState(false);

  const mergeTransition = (baseTransition?: AnimationOptions) => ({
    ...(baseTransition ?? {}),
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  });

  const hoverStart = debounce(
    () => {
      if (isHovered) return;
      setIsHovered(true);

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition)
      );

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition)
      );
    },
    100,
    { leading: true, trailing: true }
  );

  const hoverEnd = debounce(
    () => {
      setIsHovered(false);

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition)
      );

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition)
      );
    },
    100,
    { leading: true, trailing: true }
  );

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden ${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary"
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
