"use client";
import { useRive } from "@rive-app/react-canvas";

export default function RiveAnimation({ src }: { src: string }) {
  const { RiveComponent } = useRive({
    src,
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return <RiveComponent className="w-full h-full" />;
}
