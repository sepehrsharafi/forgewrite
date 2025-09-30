"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Slider from "./UI/home/Slider";
import ProcessSteps from "./UI/home/ProcessSteps";
import FallingBricks from "./UI/home/FallingBricks";
import MotionSlider from "./UI/home/MotionSlider";
import ScrollReveal from "./UI/components/ScrollReveal";
import MotionSliderHorizontal from "./UI/home/MotionSliderHorizontal";
import { services } from "@/lib/services";
import Motion from "./UI/layout/MotionContainer";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = services.length;
  const contentRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLDivElement | null>(null);
  const caseStudiesRef = useRef<HTMLParagraphElement | null>(null);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);
  const [showBricks, setShowBricks] = useState(false);
  const [showMotionSlider, setShowMotionSlider] = useState(true);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % total);
    }, 5000);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  useEffect(() => {
    const root = contentRef.current;
    const process = processRef.current;
    if (!root || !process) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBricks(entry.isIntersecting);
      },
      {
        root,
        threshold: 0,
      }
    );

    observer.observe(process);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = contentRef.current;
    const marker = caseStudiesRef.current;
    if (!root || !marker) return;

    const computeThreshold = () => {
      const markerOffset = marker.offsetTop;
      const buffer = root.clientHeight * 0.25;
      return Math.max(0, markerOffset - buffer);
    };

    const update = () => {
      const threshold = computeThreshold();
      setShowMotionSlider(root.scrollTop < threshold);
    };

    update();

    const onScroll = () => {
      update();
    };
    const onResize = () => {
      update();
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const setActiveSlideAction = useCallback(
    (index: number) => {
      const next = ((index % total) + total) % total;
      setActiveSlide(next);
      startTimer();
    },
    [total, startTimer]
  );

  return (
    <section className="flex flex-col xl:flex-row-reverse overflow-clip h-full">
      <div
        ref={sidePanelRef}
        className="transform-gpu transition-all duration-300  w-full xl:w-[355px] xl:min-w-[355px] xl:flex flex-col relative hidden h-full overflow-hidden border-t-2 border-b-2 border-[#646464]"
      >
        <Motion className="transform-gpu transition-all duration-300">
          <div
            className={`transform-gpu transition-all duration-300 absolute w-full ${
              showMotionSlider
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <MotionSlider
              beDisplayed={showMotionSlider}
              activeIndex={activeSlide}
              setActiveIndexAction={setActiveSlideAction}
            />
          </div>
          <div
            className={`transform-gpu transition-all duration-300 relative ${
              showMotionSlider
                ? "opacity-0 translate-y-4 pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
            style={{ height: "100%" }}
          >
            <div className="absolute bottom-0 left-0 w-full h-full">
              <FallingBricks isReady={showBricks} />
            </div>
          </div>
        </Motion>
      </div>

      <section
        className="z-10 mt-20 xl:mt-0 overflow-hidden bg-white flex flex-col gap-8 xl:gap-12 border-[#646464] border-2 w-full xl:w-[650px] 2xl:w-[1126px] mb p-6 xl:p-16 pb-0 xl:pb-0 h-full overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        ref={contentRef}
      >
        <div className="block xl:hidden -mx-6 -my-6 overflow-y-clip border-b-2 border-[#646464] h-[300px] min-h-[300px] ">
          <div className="xl:hidden w-full overflow-clip -mb-32 mt-10 h-96 ">
            <MotionSliderHorizontal
              activeIndex={activeSlide}
              setActiveIndexAction={setActiveSlideAction}
            />
          </div>
        </div>
        <div className="w-full">
          <h1 className="font-['PT_Sans'] font-bold text-[32px] 2xl:text-6xl text-[#1B2E31] mt-4 xl:mt-0 mb-2 2xl:mb-11 2xl:leading-[90px]">
            <ScrollReveal baseOpacity={0} enableBlur={false} baseRotation={0}>
              Engineered to Protect. <br /> Built on Legacy.
            </ScrollReveal>
          </h1>
          <h2 className="text-[#4E4E4E] font-medium text-sm 2xl:text-2xl">
            For over four generations, ForgeWrite has been at the forefront of
            fire protection engineering, combining legacy, precision, and bold
            innovation to safeguard what others build. From complex code
            challenges to high-stakes design reviews, we don`t just follow
            standards, we help define them.
          </h2>

          <Slider
            activeSlide={activeSlide}
            setActiveSlideAction={setActiveSlideAction}
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 2xl:mb-6">
            <h2 className="font-bold text-2xl 2xl:text-4xl 2xl:mb-4 text-[#1B2E31] font-['PT_Sans']">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={10}
              >
                Case studies
              </ScrollReveal>
            </h2>
            <p
              ref={caseStudiesRef}
              className="text-[#2B4A4F] font-medium text-sm 2xl:text-2xl"
            >
              From high-rise builds to complex retrofits, our case studies show
              how ForgeWrite turns code challenges into fire-safe realities.
            </p>
          </div>
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-0 justify-between">
            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-[#4D4E69] text-[32px] 2xl:text-5xl font-bold leading-[41px] font-['PT_Sans']">
                4,200,000+ ft
              </h3>
              <span className="text-[#3A646B] text-sm 2xl:text-xl">
                of fire pipe designed
              </span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-[#4D4E69] text-[32px] 2xl:text-5xl font-bold leading-[41px] font-['PT_Sans']">
                9,000+ projects
              </h3>
              <span className="text-[#3A646B] text-sm 2xl:text-xl">
                completed across the U.S.
              </span>
            </div>
          </div>
          <div className="block xl:hidden h-[300px] border-y-2 border-[#646464] -mx-6">
            <FallingBricks isReady={showBricks} />
          </div>
        </div>

        <div ref={processRef} className="flex flex-col gap-8 2xl:gap-15">
          <h2 className="font-bold text-2xl 2xl:text-4xl text-[#1B2E31] font-['PT_Sans']">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
            >
              Our process
            </ScrollReveal>
          </h2>
          <ProcessSteps />
        </div>
      </section>
    </section>
  );
}
