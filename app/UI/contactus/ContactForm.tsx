"use client";

import React from "react";
import { FlipButton, FlipButtonFront } from "@/app/UI/components/buttons/flip";
import { FlipButtonBack } from "@/app/UI/components/animate-ui/primitives/buttons/flip";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidClassName =
  "ring-2 ring-[#984134] focus:ring-[#984134] focus:ring-2 focus:ring-offset-0";
const invalidClasses = invalidClassName.split(" ");

export default function ContactForm() {
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
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting || isLocked) {
        return;
      }

      setStatus("submitting");
      setError(null);

      const fullNameValue = fullNameRef.current?.value.trim() ?? "";
      const emailValue = emailRef.current?.value.trim() ?? "";
      const messageRaw = messageRef.current?.value ?? "";
      const messageValue = messageRaw.trim();

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

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullNameValue,
            email: emailValue,
            message: messageRaw,
          }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
          throw new Error(
            data?.message ?? "We could not send your message. Please try again."
          );
        }

        setStatus("success");
        setError(null);
      } catch (submissionError) {
        console.error("Contact form submission failed", submissionError);
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "We could not send your message. Please try again."
        );
        setStatus("idle");
      }
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
  );
}
