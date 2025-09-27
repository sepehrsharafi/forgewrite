"use client";

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { services } from "../../../lib/services";

type Card = { label: string };
const labels: Card[] = services.map((s) => ({ label: s.title }));

export default function MotionSliderHorizontal({
  activeIndex, // The externally controlled index of the active card (optional)
  setActiveIndexAction, // Function to update the active index (optional)
}: {
  activeIndex?: number;
  setActiveIndexAction?: (index: number) => void;
}) {
  const n = labels.length; // Number of service cards (total items)
  const VISIBLE: number = 3; // Number of visible cards in the stack
  const REPEATS = 5; // Number of times the visible set is repeated for smooth wrapping
  const totalSlots = VISIBLE * REPEATS; // Total number of rendered card slots
  const buffer = Math.floor((totalSlots - VISIBLE) / 2); // Number of slots above/below the visible band
  const extendedCards = useMemo(
    () => Array.from({ length: totalSlots }, (_, i) => labels[i % n]), // Array of cards repeated for wrapping
    [totalSlots, n]
  );

  // Controls for layout and animation
  const amplitude = 30; // How far cards bulge toward the center (px)
  const [isXL, setIsXL] = useState<boolean>(false); // Tracks if screen is XL (desktop)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 0px)"); // Media query for XL screens
    const update = () => setIsXL(mq.matches); // Updates isXL state
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const cardWidth = 255; // Width of each card (px)
  const [containerWidth, setContainerWidth] = useState<number>(0); // Measured container width
  // Anchor for horizontal position: desktop uses fixed, mobile uses center
  const baseLeft = isXL
    ? -60 // Fixed anchor for desktop
    : Math.round(containerWidth / 2 - cardWidth / 2 - amplitude); // Centered anchor for mobile
  const tiltMax = 10; // Maximum tilt angle for cards (degrees)
  const topPad = 8; // Top padding as percent of container height
  const bottomPad = 8; // Bottom padding as percent of container height
  const containerHeight = 350; // Height of the container (px)
  const cardHeight = 100; // Height of each card (px)
  const ANIM_MS = 500; // Animation duration per step (ms)

  // State and refs for rotation and animation
  const [offset, setOffset] = useState(0); // Current offset for rotating cards
  const prevActiveRef = useRef<number | null>(null); // Tracks previous active index
  const pendingStepsRef = useRef(0); // Steps pending for animation (not used in current code)
  const runningRef = useRef(false); // Animation running flag (not used in current code)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Timer for animation cooldown
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // References to card DOM elements
  const frameRef = useRef<HTMLDivElement | null>(null); // Reference to container DOM element
  const touchStartRef = useRef<number | null>(null); // Tracks the starting X position of a touch
  const touchLockRef = useRef(false); // Lock to debounce touch input during animation

  // Measure container width to keep the active card horizontally centered on mobile
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || 0;
      if (w !== containerWidth) setContainerWidth(w);
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => {
        if (ro) {
          ro.disconnect();
        }
      };
    } else {
      window.addEventListener("resize", measure);
      return () => {
        window.removeEventListener("resize", measure);
      };
    }
  }, [containerWidth]);

  // Touch-to-select: swipe horizontally to change the selected item
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!Number.isFinite(activeIndex)) return;
    if (touchLockRef.current) {
      e.preventDefault();
      return;
    }
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current === null || !Number.isFinite(activeIndex)) return;
    if (touchLockRef.current) {
      e.preventDefault();
      return;
    }

    const deltaX = e.touches[0].clientX - touchStartRef.current;
    const THRESHOLD = 50; // Swipe threshold in pixels

    if (Math.abs(deltaX) > THRESHOLD) {
      const dir = deltaX > 0 ? -1 : 1; // Swipe right moves to previous, swipe left to next
      const base = ((activeIndex! % n) + n) % n;
      const next = (base + dir + n) % n;
      setActiveIndexAction?.(next);

      // A swipe has been registered, so we nullify the start position
      // to prevent further moves within this single touch gesture.
      touchStartRef.current = null;

      // Engage a short cooldown roughly tied to the animation duration
      touchLockRef.current = true;
      const cooldown = Math.max(150, Math.floor(ANIM_MS * 0.3));
      setTimeout(() => {
        touchLockRef.current = false;
      }, cooldown);
      e.preventDefault();
    }
  };

  const onTouchEnd = () => {
    // Ensure we reset on touch end, in case a swipe wasn't completed.
    touchStartRef.current = null;
  };

  // Sync to external index: jump directly to the selected item
  // using the shortest direction (bidirectional), no intermediate steps.
  useEffect(() => {
    if (typeof activeIndex !== "number" || !Number.isFinite(activeIndex))
      return;
    const nextNorm = ((activeIndex % n) + n) % n;
    const prevNorm = prevActiveRef.current ?? nextNorm;
    const forward = (nextNorm - prevNorm + n) % n; // [0..n-1]
    const backward = forward - n; // negative or zero
    const deltaItems = Math.abs(backward) < forward ? backward : forward;
    if (deltaItems !== 0) {
      // cancel any in-flight stepper
      pendingStepsRef.current = 0;
      runningRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      // apply a single jump; GSAP animates positions to new slots
      setOffset((p) => p + deltaItems);
    }
    prevActiveRef.current = nextNorm;
  }, [activeIndex, n]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  // Precompute immutable slot transforms so visuals never change
  const slots = useMemo(() => {
    const arr: {
      topPercent: number;
      translateX: number;
      rotate: number;
      active: boolean;
      yPx: number;
    }[] = [];
    // We generate slots well above and below the visible band.
    // Geometry (x, rotate) continues smoothly beyond the viewport so cards
    // follow the same curved path while entering/exiting (no straight pop).
    for (let idx = 0; idx < totalSlots; idx += 1) {
      const t = VISIBLE === 1 ? 0.5 : (idx - buffer) / (VISIBLE - 1); // can be <0 or >1 offscreen
      // Parabolic x curve that naturally extends beyond [0,1]: 4a t (1 - t)
      const offsetX = 4 * amplitude * t * (1 - t);
      // Linear rotation map that also extends beyond [0,1]
      const rotate = -tiltMax + tiltMax * 2 * t;
      const topPercent = topPad + t * (100 - topPad - bottomPad); // y keeps extending
      const active = idx === buffer + Math.floor(VISIBLE / 2);
      const centerY = (topPercent / 100) * containerHeight;
      const yPx = centerY - cardHeight / 2; // align the card center to slot
      arr.push({
        topPercent,
        translateX: baseLeft + offsetX,
        rotate,
        active,
        yPx,
      });
    }
    return arr;
  }, [
    VISIBLE,
    totalSlots,
    buffer,
    amplitude,
    tiltMax,
    topPad,
    bottomPad,
    baseLeft,
    containerHeight,
    cardHeight,
  ]);

  // Set initial positions with GSAP before first paint.
  // Runs on mount and if geometry lists change (rare in practice).
  useLayoutEffect(() => {
    const o = 0; // start baseline; subsequent steps animate from here
    const mid = buffer + Math.floor(VISIBLE / 2);
    extendedCards.forEach((_, cardIdx) => {
      const s = (((cardIdx - o + mid) % totalSlots) + totalSlots) % totalSlots;
      const slot = slots[s];
      const el = cardRefs.current[cardIdx];
      if (el) {
        gsap.set(el, {
          x: slot.translateX,
          y: slot.yPx,
          rotation: slot.rotate,
        });
      }
    });
  }, [buffer, VISIBLE, totalSlots, extendedCards, slots]);

  // Animate to new positions on each step using GSAP
  useLayoutEffect(() => {
    const o = ((offset % totalSlots) + totalSlots) % totalSlots;
    const mid = buffer + Math.floor(VISIBLE / 2);
    extendedCards.forEach((_, cardIdx) => {
      const s = (((cardIdx - o + mid) % totalSlots) + totalSlots) % totalSlots;
      const slot = slots[s];
      const el = cardRefs.current[cardIdx];
      if (el) {
        gsap.to(el, {
          x: slot.translateX,
          y: slot.yPx,
          rotation: slot.rotate,
          duration: ANIM_MS / 1000,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          overwrite: "auto",
        });
      }
    });
    const refsSnapshot = [...cardRefs.current];
    return () => {
      refsSnapshot.forEach((el) => el && gsap.killTweensOf(el));
    };
  }, [offset, slots, totalSlots, buffer, extendedCards]);

  const width = cardWidth;

  const mid = buffer + Math.floor(VISIBLE / 2);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-[100px] h-[375px] mx-auto rotate-x-180 rotate-y-180 rotate-90 overflow-visible select-none"
    >
      {extendedCards.map((c, cardIdx) => {
        const o = ((offset % totalSlots) + totalSlots) % totalSlots;
        const s =
          (((cardIdx - o + mid) % totalSlots) + totalSlots) % totalSlots;
        const isActive = s === mid;
        const depth = Math.abs(s - mid);
        const zIndex = 100 - Math.min(depth, 99);

        return (
          <div
            key={cardIdx}
            className={`absolute flex items-center justify-start rounded-sm border h-[110px] font-semibold transition-colors duration-150 ease-out ${
              isActive
                ? "bg-[#629199] border-[#5C898E] text-white"
                : "bg-white border-[#EBEBEB] border-2 text-[#1E2A31]"
            }`}
            ref={(el) => {
              cardRefs.current[cardIdx] = el;
            }}
            style={{
              top: 0,
              left: 0,
              width: `${width}px`,
              willChange: "transform",
              zIndex,
            }}
          >
            <span className="text-lg pl-8 pr-3 font-bold font-['PT_Sans']">
              {c.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
