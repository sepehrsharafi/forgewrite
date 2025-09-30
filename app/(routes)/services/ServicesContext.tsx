"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";

type ServicesContextType = {
  activeCategoryId: string;
  setActiveCategoryId: Dispatch<SetStateAction<string>>;
};

export const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export function useServicesContext() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error(
      "useServicesContext must be used within a ServicesProvider"
    );
  }
  return context;
}
