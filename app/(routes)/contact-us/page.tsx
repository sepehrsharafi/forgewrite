"use client";
import React from "react";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import Motion from "@/app/UI/layout/MotionContainer";
import ContentSection from "@/app/UI/layout/ContentSection";
import { FlipButton, FlipButtonFront } from "@/app/UI/components/buttons/flip";
import { FlipButtonBack } from "@/app/UI/components/animate-ui/primitives/buttons/flip";
import MyLottieComponent from "@/lib/LottieMotion";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidClassName =
  "ring-2 ring-[#984134] focus:ring-[#984134] focus:ring-2 focus:ring-offset-0";
const invalidClasses = invalidClassName.split(" ");

export default function Page() {
  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">(
    "idle"
  );
  const [error, setError] = React.useState<string | null>(null);

  const isSubmitting = status === "submitting";
  const isLocked = status === "success";

  const clearInvalid = (
    element: HTMLInputElement | HTMLTextAreaElement | null
  ) => {
    if (!element) {
      return;
    }

    invalidClasses.forEach((className) => {
      element.classList.remove(className);
    });
    element.removeAttribute("aria-invalid");
  };

  const markInvalid = (
    element: HTMLInputElement | HTMLTextAreaElement | null
  ) => {
    if (!element) {
      return;
    }

    invalidClasses.forEach((className) => {
      element.classList.add(className);
    });
    element.setAttribute("aria-invalid", "true");
  };

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting || isLocked) {
        return;
      }

      setStatus("submitting");
      setError(null);

      const fullNameValue = fullNameRef.current?.value.trim() ?? "";
      const emailValue = emailRef.current?.value.trim() ?? "";
      const messageValue = messageRef.current?.value.trim() ?? "";

      let hasError = false;
      let nextError: string | null = null;

      if (!fullNameValue) {
        markInvalid(fullNameRef.current);
        hasError = true;
      }

      if (!emailValue) {
        markInvalid(emailRef.current);
        hasError = true;
        nextError = "Please complete every field before submitting.";
      } else if (!emailPattern.test(emailValue)) {
        markInvalid(emailRef.current);
        hasError = true;
        nextError = "Please enter a valid email address.";
      }

      if (!messageValue) {
        markInvalid(messageRef.current);
        hasError = true;
      }

      if (hasError) {
        setError(nextError ?? "Please complete every field before submitting.");
        setStatus("idle");
        return;
      }

      clearInvalid(fullNameRef.current);
      clearInvalid(emailRef.current);
      clearInvalid(messageRef.current);

      console.log("Contact form submission", {
        fullName: fullNameValue,
        email: emailValue,
        message: messageValue,
      });

      setStatus("success");
      setError(null);
    },
    [isLocked, isSubmitting]
  );

  const handleFullNameInput = () => {
    if (isLocked) {
      return;
    }
    const element = fullNameRef.current;
    if (element && element.value.trim()) {
      clearInvalid(element);
      setError(null);
    }
  };

  const handleEmailInput = () => {
    if (isLocked) {
      return;
    }
    const element = emailRef.current;
    if (!element) {
      return;
    }
    const value = element.value.trim();
    if (!value) {
      return;
    }
    if (emailPattern.test(value)) {
      clearInvalid(element);
      setError(null);
    }
  };

  const handleMessageInput = () => {
    if (isLocked) {
      return;
    }
    const element = messageRef.current;
    if (element && element.value.trim()) {
      clearInvalid(element);
      setError(null);
    }
  };

  const buttonLabel = isSubmitting
    ? "Submitting..."
    : isLocked
    ? "Submitted"
    : "Submit";

  const buttonStateClassName =
    isSubmitting || isLocked ? " cursor-not-allowed opacity-75" : "";

  return (
    <>
      <ContentSection>
        <div className="block xl:hidden -mt-10 -mx-6">
          <Motion>
            <MyLottieComponent
              motionLocation={"/motion/Mobile-responsive/M-Contact Us.json"}
            />
          </Motion>
        </div>
        <ContentHeader
          title={"Contact Us"}
          description={
            "If you want a new project, maintenance, repair services, or just have some questions, feel free to get in touch with us."
          }
        />
        <div className="flex flex-col gap-y-3 2xl:gap-y-5">
          <div className="bg-[#EBEBEB] h-px"></div>
          <div className="flex flex-col justify-start text-base 2xl:text-2xl font-medium gap-3 2xl:gap-5">
            <div className="flex flex-row items-center justify-start gap-2 text-[#629199] ">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18Z"
                  fill="#629199"
                />
              </svg>
              <span>Contacts</span>
            </div>
            <span className="text-sm 2xl:text-xl font-medium">
              +1 (234) 567 89 00 - inquiries@forgewrite.com
            </span>
          </div>
          <div className="bg-[#EBEBEB] h-px"></div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          noValidate
        >
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {isLocked && (
            <p className="text-sm font-medium text-[#629199]">
              Thanks! We will get back to you soon.
            </p>
          )}
          <div className="flex flex-col xl:flex-row justify-between 2xl:text-lg gap-4 w-full">
            <input
              ref={fullNameRef}
              className="bg-[#F8F8F8] rounded-sm px-4 py-3.5 w-full outline-none focus:outline-none"
              placeholder="Full Name"
              type="text"
              aria-label="full name"
              autoComplete="given-name"
              name="fullName"
              onInput={handleFullNameInput}
              disabled={isSubmitting || isLocked}
              required
            />
            <input
              ref={emailRef}
              className="bg-[#F8F8F8] rounded-sm px-4 py-3.5 w-full outline-none focus:outline-none"
              placeholder="Email"
              type="email"
              aria-label="email"
              autoComplete="email"
              name="email"
              onInput={handleEmailInput}
              disabled={isSubmitting || isLocked}
              required
            />
          </div>
          <textarea
            ref={messageRef}
            className="bg-[#F8F8F8] rounded-sm px-4 py-3.5 w-full outline-none focus:outline-none"
            placeholder="Message"
            rows={4}
            aria-label="message"
            autoComplete="off"
            name="message"
            onInput={handleMessageInput}
            disabled={isSubmitting || isLocked}
            required
          />
          <FlipButton
            type="submit"
            disabled={isSubmitting || isLocked}
            className={`xl:flex xl:justify-start  xl:w-fit w-full 2xl:w-fit ${buttonStateClassName}`}
            aria-disabled={isSubmitting || isLocked}
          >
            <FlipButtonFront
              className={`text-sm 2xl:text-base bg-[#232733] h-full px-18 py-2.5 text-white font-medium rounded-sm w-full xl:w-[200px] 2xl:w-[240px] ${buttonStateClassName}`}
            >
              {buttonLabel}
            </FlipButtonFront>
            <FlipButtonBack
              className={`text-sm 2xl:text-base px-18 py-2.5 bg-white h-full text-black font-medium rounded-sm w-full xl:w-[200px] 2xl:w-[240px] border-2 border-[#EBEBEB]${buttonStateClassName}`}
            >
              {buttonLabel}
            </FlipButtonBack>
          </FlipButton>
        </form>
      </ContentSection>
      <div className=" border-b-2 border-t-2 border-[#646464] hidden xl:block">
        <Motion>
          <MyLottieComponent
            motionLocation={
              "/motion/Medium Desktop - responsive/D1-Contact Us.json"
            }
          />
        </Motion>
      </div>
    </>
  );
}
