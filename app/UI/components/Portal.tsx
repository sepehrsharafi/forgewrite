"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (typeof window === "undefined" || !mounted) {
    return null;
  }

  const modalRoot = document.getElementById("modal");
  return modalRoot ? createPortal(children, modalRoot) : null;
};

export default Portal;