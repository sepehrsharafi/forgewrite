"use client";
import React, { useEffect, useRef, useState } from "react";
// Note: The top-level 'import Matter from "matter-js"' is intentionally removed.

// --- TYPE DEFINITIONS ---
// We use a special TypeScript utility to get the type of the Matter library
type MatterType = typeof import("matter-js");

interface Brick {
  id: string;
  body: import("matter-js").Body;
  text: string;
  color: string;
  type: "text" | "number";
}

// --- CONSTANTS ---
const PROMOTIONAL_TEXTS = [
  "Assess & Strategize",
  "Engineer & Design",
  "Document & Coordinate",
  "Oversee & Review",
  "Test & Deliver",
];
const COLORS = ["#629199", "#4D4E69"];

// --- HELPER FUNCTIONS ---
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// --- COMPONENT ---
interface Props {
  height?: number | string;
  isReady?: boolean;
}

const FallingBricks = ({ height, isReady }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<import("matter-js").Engine | null>(null);
  const matterRef = useRef<MatterType | null>(null);
  const mouseConstraintRef = useRef<import("matter-js").MouseConstraint | null>(
    null
  );
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [brickSizes, setBrickSizes] = useState({
    textWidth: 160,
    textHeight: 70,
    numberSize: 50,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const updateSizes = () => {
      if (mediaQuery.matches) {
        // Desktop
        setBrickSizes({
          textWidth: 150,
          textHeight: 60,
          numberSize: 40,
        });
      } else {
        // Mobile
        setBrickSizes({
          textWidth: 120,
          textHeight: 50,
          numberSize: 40,
        });
      }
    };

    updateSizes();
    mediaQuery.addEventListener("change", updateSizes);

    return () => {
      mediaQuery.removeEventListener("change", updateSizes);
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !isReady) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Matter = require("matter-js");
    matterRef.current = Matter;
    const container = containerRef.current;
    if (!container) return;

    // Create engine and world
    const engine = Matter.Engine.create({
      enableSleeping: true,
      positionIterations: 16,
      velocityIterations: 14,
    });
    engineRef.current = engine;
    const world = engine.world;
    engine.gravity.y = 1.5;

    const { clientWidth: width, clientHeight: height } = container;

    // Create static boundaries
    const wallOptions = { isStatic: true, restitution: 0.1, friction: 0.75 };
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height + 50,
      width + 100,
      100,
      wallOptions
    );
    const leftWall = Matter.Bodies.rectangle(
      -50,
      height / 2,
      100,
      height * 2,
      wallOptions
    );
    const rightWall = Matter.Bodies.rectangle(
      width + 50,
      height / 2,
      100,
      height * 2,
      wallOptions
    );
    const ceiling = Matter.Bodies.rectangle(
      width / 2,
      -50,
      width + 100,
      100,
      wallOptions
    );
    Matter.Composite.add(world, [ground, leftWall, rightWall, ceiling]);

    // Add mouse control
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.9, render: { visible: false } },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.Composite.add(world, mouseConstraint);

    // Sequentially add bricks
    let brickIndex = 0;
    const intervalId = setInterval(() => {
      if (brickIndex >= PROMOTIONAL_TEXTS.length) {
        clearInterval(intervalId);
        return;
      }

      const text = PROMOTIONAL_TEXTS[brickIndex];
      const number = (brickIndex + 1).toString();
      const color = getRandomColor();
      const x = width / 2 + (Math.random() - 0.5) * 100; // Increase spread range

      const textBody = Matter.Bodies.rectangle(
        x,
        -30,
        brickSizes.textWidth,
        brickSizes.textHeight,
        {
          restitution: 0.5, // Add some bounce
          friction: 0.8,
          frictionStatic: 0.5,
          slop: 0.3, // Increase slop for better collision
          angle: (Math.random() - 0.5) * 0.3,
          density: 0.021, // Add density to prevent overlapping
        }
      );
      const textBrick: Brick = {
        id: textBody.id.toString(),
        body: textBody,
        text,
        color,
        type: "text",
      };

      const numberBody = Matter.Bodies.rectangle(
        x,
        -80,
        brickSizes.numberSize,
        brickSizes.numberSize,
        {
          restitution: 0.5, // Add some bounce
          friction: 0.8,
          frictionStatic: 0.5,
          slop: 0.3, // Increase slop for better collision
          angle: (Math.random() - 0.5) * 0.3,
          density: 0.021, // Add density to prevent overlapping
        }
      );
      const numberBrick: Brick = {
        id: numberBody.id.toString(),
        body: numberBody,
        text: number,
        color,
        type: "number",
      };

      const constraint = Matter.Constraint.create({
        bodyA: textBody,
        bodyB: numberBody,
        stiffness: 0.9,
        length: brickSizes.textHeight / 2 + brickSizes.numberSize / 2 + 10,
        render: { visible: false },
      });

      Matter.Composite.add(world, [textBody, numberBody, constraint]);
      setBricks((prev) => [...prev, textBrick, numberBrick]);

      brickIndex++;
    }, 1000); // Increase delay between bricks from 1000ms to 1500ms

    // Animation loop
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const update = () => {
      setBricks((currentBricks) => [...currentBricks]);
      requestAnimationFrame(update);
    };
    const animationFrameId = requestAnimationFrame(update);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId);
      setBricks([]); // <-- Add this line to reset the game state
      if (matterRef.current && engineRef.current) {
        const M = matterRef.current;
        const E = engineRef.current;
        M.Runner.stop(runner);
        M.World.clear(E.world, false);
        M.Engine.clear(E);
      }
    };
  }, [isVisible, brickSizes, isReady]);

  useEffect(() => {
    if (!isVisible || !matterRef.current || !mouseConstraintRef.current) return;

    const scalerWrapper = document.getElementById("scaler-wrapper");
    if (!scalerWrapper) return;

    const M = matterRef.current;
    const mc = mouseConstraintRef.current;

    const updateScale = () => {
      const transform = window.getComputedStyle(scalerWrapper).transform;
      let scale = 1;
      if (transform && transform !== "none") {
        const matrix = new DOMMatrix(transform);
        scale = matrix.a;
      }
      M.Mouse.setScale(mc.mouse, { x: 1 / scale, y: 1 / scale });
    };

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(scalerWrapper);

    updateScale();

    return () => {
      resizeObserver.disconnect();
    };
  }, [isVisible]);

  const containerStyle: React.CSSProperties = {
    height:
      height === undefined
        ? "100%"
        : typeof height === "number"
        ? `${height}px`
        : height,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white overflow-hidden"
      style={containerStyle}
    >
      {bricks.map(({ id, body, color, text, type }) => {
        const { x, y } = body.position;
        const angle = body.angle;
        const isText = type === "text";
        const width = isText ? brickSizes.textWidth : brickSizes.numberSize;
        const height = isText ? brickSizes.textHeight : brickSizes.numberSize;

        const style: React.CSSProperties = {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${x - width / 2}px, ${
            y - height / 2
          }px) rotate(${angle}rad)`,
        };

        if (isText) {
          style.backgroundColor = "white";
          style.borderColor = color;
          style.color = color;
        } else {
          style.backgroundColor = color;
        }

        return (
          <div
            key={id}
            className={`absolute top-0 left-0 flex px-2 items-center w-full justify-center text-center rounded-md shadow-lg font-sans text-sm select-none ${
              isText ? "border" : "text-white"
            }`}
            style={style}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

export default FallingBricks;
