"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import NavBar from "./UI/layout/NavBar";
import SanityBootstrap from "../lib/SanityBootstrap";
import Scaler from "@/components/Scaler";
import WelcomeModal from "@/components/WelcomeModal";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [appState, setAppState] = useState("loading");

  useEffect(() => {
    if (sessionStorage.getItem("hasVisited")) {
      setAppState("ready");
    } else {
      setAppState("welcoming");
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleWelcomeClose = () => {
    setAppState("ready");
  };

  return (
    <>
      {appState === "welcoming" && (
        <WelcomeModal onClose={handleWelcomeClose} />
      )}
      <SanityBootstrap />
      <Scaler />

      <div
        className={`flex flex-col xl:flex-row-reverse items-center justify-center transition-opacity duration-500  ${
          appState === "ready" ? "opacity-100" : "opacity-0"
        }`}
        id="scaler-wrapper"
      >
        <NavBar />
        <main className="flex flex-col-reverse xl:flex-row p-4 pt-0 xl:p-0 w-screen xl:w-fit xl:h-full h-dvh">
          {children}
        </main>
      </div>
    </>
  );
}
