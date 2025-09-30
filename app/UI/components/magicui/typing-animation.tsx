"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

type BaseProps = {
  words: string[];
  speed?: number;
  pause?: number;
  loop?: boolean;
  as?: ElementType;
  className?: string;
};

type TypingAnimationProps<T extends ElementType> = BaseProps &
  Omit<ComponentPropsWithoutRef<T>, keyof BaseProps>;

const DEFAULT_SPEED = 75;
const DEFAULT_PAUSE = 1200;

export function TypingAnimation<T extends ElementType = "span">({
  words,
  speed = DEFAULT_SPEED,
  pause = DEFAULT_PAUSE,
  loop = true,
  as,
  className,
  ...rest
}: TypingAnimationProps<T>) {
  const Element = (as ?? "span") as ElementType;
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const safeWords = useMemo(() => (words.length > 0 ? words : [""]), [words]);
  const currentWord = safeWords[wordIndex] ?? "";
  const displayed = currentWord.slice(0, charIndex);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    if (isDeleting) {
      if (charIndex > 0) {
        timeoutRef.current = window.setTimeout(
          () => setCharIndex((value) => value - 1),
          Math.max(16, speed / 2)
        );
      } else {
        setIsDeleting(false);
        setWordIndex((index) => {
          const next = index + 1;
          if (next >= safeWords.length) {
            return loop ? 0 : index;
          }
          return next;
        });
      }
      return () => {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }

    if (charIndex < currentWord.length) {
      timeoutRef.current = window.setTimeout(
        () => setCharIndex((value) => value + 1),
        Math.max(16, speed)
      );
      return () => {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }

    if (!loop && wordIndex === safeWords.length - 1) {
      return () => undefined;
    }

    timeoutRef.current = window.setTimeout(() => setIsDeleting(true), pause);
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [
    charIndex,
    currentWord,
    isDeleting,
    loop,
    pause,
    safeWords.length,
    speed,
    wordIndex,
  ]);

  return (
    <Element
      {...rest}
      className={className}
      data-typing-animation
      aria-live="polite"
    >
      {displayed}
    </Element>
  );
}

export default TypingAnimation;
