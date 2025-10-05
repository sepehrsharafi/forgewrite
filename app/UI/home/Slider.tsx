"use client";
import { useEffect, useRef, useState } from "react";
import { services as sliderData } from "../../../lib/services";
import { TypingAnimation } from "@/app/UI/components/magicui/typing-animation";
import { NumberTicker } from "@/app/UI/components/magicui/number-ticker";

export default function Slider({
  activeSlide,
  setActiveSlideAction,
}: {
  activeSlide: number;
  setActiveSlideAction: (index: number) => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const previousSlideRef = useRef(activeSlide);

  useEffect(() => {
    previousSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [activeSlide]);

  const currentService = sliderData[activeSlide];
  const previousService =
    sliderData[previousSlideRef.current] ?? currentService;

  const currentIdLength = currentService.id.replace(/[^0-9]/g, "").length || 2;
  const parseId = (id: string) => {
    const numeric = Number(id.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const previousNumericId = parseId(previousService.id);

  const formatId = (value: number) =>
    Math.round(value).toLocaleString("en-US", {
      minimumIntegerDigits: currentIdLength,
      useGrouping: false,
    });

  const handleSetNav = (index: number) => {
    if (index === activeSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSlideAction(index);
    }, 300);
  };

  return (
    <div className="p-4 py-5 xl:p-8 w-full xl:w-full flex flex-col gap-3 xl:gap-8 justify-between bg-[#4D4E69] rounded-sm text-white my-7">
      <div
        className={`flex flex-col w-fit transition-transform duration-300 ${
          isAnimating ? "transform scale-95" : "transform scale-100"
        }`}
      >
        <span className={`leading-[90px] xl:leading-[140px] h-20 xl:h-33 mb-4`}>
          <NumberTicker
            key={`service-id-${activeSlide}`}
            value={parseId(currentService.id)}
            startValue={previousNumericId}
            duration={600}
            format={formatId}
            className="font-['PT_Sans'] text-[80px] xl:text-[120px] font-bold text-[#999FB6]"
          />
        </span>
        <span className="font-['PT_Sans']  min-h-6 2xl:min-h-10 font-bold mb-[10px]">
          <TypingAnimation
            key={`service-title-${activeSlide}`}
            words={[currentService.title]}
            className="font-['PT_Sans'] text-base 2xl:text-2xl font-bold"
            loop={false}
            pause={1500}
            speed={80}
          ></TypingAnimation>
        </span>
        <p className="min-h-20 xl:min-h-12 2xl:min-h-14 -mb-3">
          <TypingAnimation
            key={`service-description-${activeSlide}`}
            words={[currentService.description]}
            className="font-['PT_Sans'] text-sm 2xl:text-lg font-normal"
            loop={false}
            pause={1500}
            speed={1}
          ></TypingAnimation>
        </p>
      </div>
      <div className="flex flex-row justify-between gap-3 overflow-hidden">
        {sliderData.map((_, index) => (
          <div
            key={index}
            className="h-[5px] w-full cursor-pointer rounded-full bg-[#232733] relative"
            onClick={() => handleSetNav(index)}
          >
            <div
              className={`h-full rounded-full bg-[#999FB6] absolute top-0 left-0
                ${
                  activeSlide === index
                    ? "w-full transition-all duration-500"
                    : "w-0"
                }
              `}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
