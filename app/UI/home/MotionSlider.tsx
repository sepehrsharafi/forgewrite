"use client";

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { services } from "@/lib/services";

// Rotating stack of service cards that preserves the
// exact visual layout and angles while cycling content through
// fixed-position slots. The visuals never change; only which
// label appears in each slot changes.

type Card = { label: string };
const labels: Card[] = services.map((s) => ({ label: s.title }));

export default function MotionSlider({
  beDisplayed,
  activeIndex,
  setActiveIndexAction,
}: {
  // Optional: provide an external index to align with another slider.
  // When provided, the stack will rotate its data so that the middle slot
  // shows labels[activeIndex], while each slot keeps the same angle/position.
  beDisplayed: boolean;
  activeIndex?: number;
  setActiveIndexAction?: (index: number) => void;
}) {
  const n = labels.length; // total content items
  const VISIBLE: number = 5; // visible slots in the stack
  // Create an extended, repeated set of slots so wrapping happens fully offscreen
  const REPEATS = 5; // odd number so the visible set sits centered
  const totalSlots = VISIBLE * REPEATS; // total rendered cards/slots
  const buffer = Math.floor((totalSlots - VISIBLE) / 2); // slots above and below the visible band

  // State to force re-render when container size changes
  const [containerKey, setContainerKey] = useState(0);

  // Controls – these define the visual layout and do not change during rotation
  const amplitude = 50; // px, distance from center to left/rightmost cards
  const cardWidth = 295; // px
  const containerHeight = 700; // px
  const cardHeight = 120; // px

  // Responsive base anchor so the active card is horizontally centered on mobile
  const [isXL, setIsXL] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsXL(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [currentContainerWidth, setCurrentContainerWidth] = useState(0);

  // On desktop keep legacy anchor; on mobile compute center-based anchor
  const baseLeft = isXL
    ? -60
    : Math.round(currentContainerWidth / 2 - cardWidth / 2 - amplitude);
  const tiltMax = 10; // deg, max tilt top/bottom
  const topPad = 8; // %, keep cards fully inside container
  const bottomPad = 8; // %

  const ANIM_MS = 500; // per-step duration

  // We rotate data into fixed slots via an offset.
  // By design, slots keep their exact transform; only the label changes.
  const [offset, setOffset] = useState(0);
  const prevActiveRef = useRef<number | null>(null);
  const pendingStepsRef = useRef(0);
  const runningRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelLockRef = useRef(false);

  // Measure container width and trigger re-render on resize
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const measure = () => {
      const { width } = el.getBoundingClientRect();
      if (width !== currentContainerWidth) {
        setCurrentContainerWidth(width);
        setContainerKey((prevKey) => prevKey + 1); // Force re-render
      }
    };

    measure(); // Initial measurement
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [currentContainerWidth]);

  // Wheel-to-select: scroll inside MotionSlider changes the selected item
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!Number.isFinite(activeIndex)) return;
    // If we're mid-animation, debounce further wheel input
    if (wheelLockRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    wheelAccumRef.current += e.deltaY;
    const THRESHOLD = 80;
    const steps = Math.trunc(wheelAccumRef.current / THRESHOLD);
    if (steps !== 0) {
      wheelAccumRef.current -= steps * THRESHOLD;
      const base = ((activeIndex! % n) + n) % n;
      // Cap to a single step per wheel resolution to avoid overspin
      const dir = steps > 0 ? 1 : -1;
      const next = (base + dir + n) % n;
      setActiveIndexAction?.(next);
      // Engage a short cooldown roughly tied to the animation duration
      wheelLockRef.current = true;
      const cooldown = Math.max(150, Math.floor(ANIM_MS * 0.3));
      setTimeout(() => {
        wheelLockRef.current = false;
      }, cooldown);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Sync to external index: jump directly to the selected item
  // using the shortest direction (bidirectional), no intermediate steps.
  useEffect(() => {
    if (typeof activeIndex !== "number" || !Number.isFinite(activeIndex))
      return;

    const nextNorm = ((activeIndex % n) + n) % n;
    const prevNorm = prevActiveRef.current ?? nextNorm;

    // Find the shortest path to the next index
    const forward = (nextNorm - prevNorm + n) % n;
    const backward = forward - n;
    const deltaItems = Math.abs(backward) < forward ? backward : forward;

    if (deltaItems !== 0) {
      // cancel any in-flight stepper
      pendingStepsRef.current = 0;
      runningRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;

      // Apply a single jump; GSAP animates positions to new slots
      setOffset((prevOffset) => {
        const newOffset = prevOffset + deltaItems;
        // To prevent the offset from growing indefinitely and causing sync issues,
        // we'll keep it within a large but bounded range.
        // The range is a multiple of n * totalSlots to ensure all calculations align.
        const cycle = n * totalSlots * 2;
        return ((newOffset % cycle) + cycle) % cycle;
      });
    }

    prevActiveRef.current = nextNorm;
  }, [activeIndex, n, totalSlots]);

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
    // follow the same curved path while entering/exiting (no straight pop).\
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
    containerKey, // Add containerKey to dependencies to trigger re-memoization
  ]);

  // Set initial positions with GSAP before first paint.
  // Runs on mount and if geometry lists change (rare in practice).
  useLayoutEffect(() => {
    const o = 0; // start baseline; subsequent steps animate from here
    const mid = buffer + Math.floor(VISIBLE / 2);
    Array.from({ length: totalSlots }).forEach((_, cardIdx) => {
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
  }, [buffer, VISIBLE, totalSlots, slots]);

  // Animate to new positions on each step using GSAP
  useLayoutEffect(() => {
    const o = ((offset % totalSlots) + totalSlots) % totalSlots;
    const mid = buffer + Math.floor(VISIBLE / 2);
    Array.from({ length: totalSlots }).forEach((_, cardIdx) => {
      const s = (((cardIdx - o + mid) % totalSlots) + totalSlots) % totalSlots;
      const slot = slots[s];
      const el = cardRefs.current[cardIdx];
      const isActive = s === mid;
      if (el) {
        gsap.to(el, {
          x: slot.translateX,
          y: slot.yPx,
          rotation: slot.rotate,
          duration: ANIM_MS / 1000,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          overwrite: "auto",
        });
        gsap.to(el, {
          backgroundColor: isActive ? "#5C898E" : "#FFFFFF",
          borderColor: isActive ? "#5C898E" : "#EBEBEB",
          color: isActive ? "#FFFFFF" : "#1E2A31",
          borderWidth: isActive ? 1 : 2,
          duration: 0.15,
          ease: "power1.inOut",
          overwrite: "auto",
        });
      }
    });
    const refsSnapshot = [...cardRefs.current];
    return () => {
      refsSnapshot.forEach((el) => el && gsap.killTweensOf(el));
    };
  }, [offset, slots, totalSlots, buffer]);

  const mid = buffer + Math.floor(VISIBLE / 2);

  return (
    <div
      ref={frameRef}
      key={containerKey} // Add key to force re-render of the component tree
      className={`-z-10 transition-all duration-300 ${
        !beDisplayed && "h-0 opacity-0"
      } mx-auto relative w-full xl:h-screen overflow-clip select-none`}
      onWheel={onWheel}
      style={{
        // height: `${containerHeight}px`,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className={`absolute xl:inset-0 top-1/2 border-b-2 left-0 translate-x-0 xl:translate-y-[6%] 2xl:translate-y-[4%]`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="relative w-full h-full">
          {Array.from({ length: totalSlots }).map((_, cardIdx) => {
            const o = ((offset % totalSlots) + totalSlots) % totalSlots;
            const s =
              (((cardIdx - o + mid) % totalSlots) + totalSlots) % totalSlots;
            const depth = Math.abs(s - mid);
            const zIndex = 100 - Math.min(depth, 99);
            const contentIndexRaw = offset + (s - mid);
            const contentIndex = ((contentIndexRaw % n) + n) % n;
            const c = labels[contentIndex];

            return (
              <div
                key={cardIdx}
                className="absolute flex items-center justify-center rounded-sm border font-semibold"
                ref={(el) => {
                  cardRefs.current[cardIdx] = el;
                }}
                style={{
                  top: 0,
                  left: 0,
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  willChange: "transform",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  zIndex,
                }}
              >
                <span className="subpixel-antialiased px-16 text-lg font-bold font-['PT_Sans']">
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
