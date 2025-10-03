"use client";
import React, { useEffect, useRef, useState } from "react";

type RapierModule = typeof import("@dimforge/rapier2d-compat");
type RapierWorld = import("@dimforge/rapier2d-compat").World;

type BrickType = "text" | "number";

interface BrickSizes {
  textWidth: number;
  textHeight: number;
  numberSize: number;
}

interface BrickInternal {
  id: string;
  pairId: string;
  handle: number;
  text: string;
  color: string;
  type: BrickType;
  width: number;
  height: number;
}

interface VisualBrick extends Omit<BrickInternal, "handle"> {
  x: number;
  y: number;
  angle: number;
}

interface DragState {
  brickId: string | null;
  pointerId: number | null;
  offset: {
    x: number;
    y: number;
  };
  lastPosition: {
    x: number;
    y: number;
  } | null;
  lastTimestamp: number;
  velocity: {
    x: number;
    y: number;
  };
}

const PROMOTIONAL_TEXTS = [
  "Assess & Strategize",
  "Engineer & Design",
  "Document & Coordinate",
  "Oversee & Review",
  "Test & Deliver",
];
// Colors used for both the text outline and companion number bricks.
const COLORS = ["#629199", "#4D4E69"];
// Delay (ms) between each spawned text/number pair.
const FALL_INTERVAL_MS = 1500;
// Increase to make bricks fall faster; lower numbers slow the simulation.
const GRAVITY = 1200;

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

interface Props {
  height?: number | string;
  isReady?: boolean;
}

const resetDragState = (): DragState => ({
  brickId: null,
  pointerId: null,
  offset: { x: 0, y: 0 },
  lastPosition: null,
  lastTimestamp: 0,
  velocity: { x: 0, y: 0 },
});

const FallingBricks = ({ height, isReady }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rapierPromiseRef = useRef<Promise<RapierModule> | null>(null);
  const rapierRef = useRef<RapierModule | null>(null);
  const worldRef = useRef<RapierWorld | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<number | null>(null);
  const bricksRef = useRef<BrickInternal[]>([]);
  const dragStateRef = useRef<DragState>(resetDragState());
  const [bricks, setBricks] = useState<VisualBrick[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [brickSizes, setBrickSizes] = useState<BrickSizes>({
    textWidth: 160,
    textHeight: 70,
    numberSize: 50,
  });

  // Lazy-load and init Rapier only when the animation actually runs.
  const loadRapier = () => {
    if (!rapierPromiseRef.current) {
      rapierPromiseRef.current = import("@dimforge/rapier2d-compat").then(
        async (module) => {
          await module.init();
          return module;
        }
      );
    }

    return rapierPromiseRef.current;
  };

  // Translate pointer coordinates into the unscaled container space so dragging stays aligned.
  const computePointerPosition = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const scaleX = container.clientWidth / rect.width;
    const scaleY = container.clientHeight / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const updateSizes = () => {
      if (mediaQuery.matches) {
        setBrickSizes({
          textWidth: 150,
          textHeight: 60,
          numberSize: 40,
        });
      } else {
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

    const node = containerRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !isReady) return;

    let cancelled = false;
    let localWorld: RapierWorld | null = null;

    const setupWorld = async () => {
      const container = containerRef.current;
      if (!container) return;
      const { clientWidth: width, clientHeight: heightPx } = container;
      if (width === 0 || heightPx === 0) return;

      const rapier = await loadRapier();
      if (cancelled) return;

      rapierRef.current = rapier;
      const world = new rapier.World({ x: 0, y: GRAVITY });
      worldRef.current = world;
      localWorld = world;

      bricksRef.current = [];
      dragStateRef.current = resetDragState();
      setBricks([]);

      // Helper to wrap the play area with static colliders so bricks stay onscreen.
      const createBoundary = (x: number, y: number, w: number, h: number) => {
        const body = world.createRigidBody(
          rapier.RigidBodyDesc.fixed().setTranslation(x, y)
        );
        world.createCollider(
          rapier.ColliderDesc.cuboid(w / 2, h / 2)
            .setRestitution(0.4)
            .setFriction(0.9),
          body
        );
      };

      createBoundary(width / 2, heightPx + 60, width + 120, 120);
      createBoundary(-60, heightPx / 2, 120, heightPx * 2);
      createBoundary(width + 60, heightPx / 2, 120, heightPx * 2);
      createBoundary(width / 2, -60, width + 120, 120);

      // Spawn a promotional text brick and its numbered companion, linked by a spring joint.
      const spawnPair = (index: number) => {
        if (index >= PROMOTIONAL_TEXTS.length) return;
        const text = PROMOTIONAL_TEXTS[index];
        const number = (index + 1).toString(); // Update this if you want different numbering.
        const color = getRandomColor(); // Randomize per pair so colors stay varied.
        const pairId = `pair-${index}`;
        const x = width / 2 + (Math.random() - 0.5) * 100;

        const textBody = world.createRigidBody(
          rapier.RigidBodyDesc.dynamic()
            .setTranslation(x, -brickSizes.textHeight)
            .setLinearDamping(1.2)
            .setAngularDamping(0.8)
        );
        textBody.enableCcd(true);
        world.createCollider(
          rapier.ColliderDesc.cuboid(
            brickSizes.textWidth / 2,
            brickSizes.textHeight / 2
          )
            .setDensity(0.021)
            .setRestitution(0.75)
            .setFriction(0.6),
          textBody
        );

        const textId = `text-${textBody.handle}`;
        bricksRef.current.push({
          id: textId,
          pairId,
          handle: textBody.handle,
          text,
          color,
          type: "text",
          width: brickSizes.textWidth,
          height: brickSizes.textHeight,
        });

        const numberBody = world.createRigidBody(
          rapier.RigidBodyDesc.dynamic()
            .setTranslation(
              x + brickSizes.textWidth / 2 + brickSizes.numberSize / 2 + 10, // Position to the right of the text brick
              -brickSizes.textHeight // Align vertically with the text brick
            )
            .setLinearDamping(1.2)
            .setAngularDamping(0.8)
        );
        numberBody.enableCcd(true);
        world.createCollider(
          rapier.ColliderDesc.cuboid(
            brickSizes.numberSize / 2,
            brickSizes.numberSize / 2
          )
            .setDensity(0.021)
            .setRestitution(0.75)
            .setFriction(0.6),
          numberBody
        );

        const numberId = `number-${numberBody.handle}`;
        bricksRef.current.push({
          id: numberId,
          pairId,
          handle: numberBody.handle,
          text: number,
          color,
          type: "number",
          width: brickSizes.numberSize,
          height: brickSizes.numberSize,
        });

        // Distance the joint tries to maintain between the bricks.
        const restLength =
          brickSizes.textWidth / 2 + brickSizes.numberSize / 2 + 10; // Adjust restLength for horizontal joint
        const joint = rapier.JointData.spring(
          restLength,
          40,
          3,
          { x: brickSizes.textWidth / 2, y: 0 }, // Anchor on the right side of the text brick
          { x: -brickSizes.numberSize / 2, y: 0 } // Anchor on the left side of the number brick
        );
        world.createImpulseJoint(joint, textBody, numberBody, true);
      };

      if (PROMOTIONAL_TEXTS.length > 0) {
        spawnPair(0);
        let nextIndex = 1;

        if (nextIndex < PROMOTIONAL_TEXTS.length) {
          spawnIntervalRef.current = window.setInterval(() => {
            spawnPair(nextIndex);
            nextIndex += 1;

            if (
              nextIndex >= PROMOTIONAL_TEXTS.length &&
              spawnIntervalRef.current !== null
            ) {
              window.clearInterval(spawnIntervalRef.current);
              spawnIntervalRef.current = null;
            }
          }, FALL_INTERVAL_MS);
        }
      }

      // Advance the Rapier simulation and sync positions back to React state.
      const step = () => {
        if (cancelled) return;
        world.step();

        const nextBricks: VisualBrick[] = [];
        for (const brick of bricksRef.current) {
          const body = world.getRigidBody(brick.handle);
          if (!body) continue;
          const position = body.translation();
          const angle = body.rotation();

          nextBricks.push({
            id: brick.id,
            pairId: brick.pairId,
            text: brick.text,
            color: brick.color,
            type: brick.type,
            width: brick.width,
            height: brick.height,
            x: position.x,
            y: position.y,
            angle,
          });
        }

        setBricks(nextBricks);
        animationFrameRef.current = window.requestAnimationFrame(step);
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    setupWorld();

    return () => {
      cancelled = true;
      if (spawnIntervalRef.current !== null) {
        window.clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      bricksRef.current = [];
      dragStateRef.current = resetDragState();
      setBricks([]);

      if (localWorld) {
        localWorld.free();
      }
      if (worldRef.current === localWorld) {
        worldRef.current = null;
      }
    };
  }, [isVisible, brickSizes, isReady]);

  // Begin dragging: capture pointer offset and initialize velocity tracking.
  const handlePointerDown = (
    brickId: string,
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const world = worldRef.current;
    if (!world) return;

    const pointer = computePointerPosition(event.clientX, event.clientY);
    if (!pointer) return;

    const brick = bricksRef.current.find((item) => item.id === brickId);
    if (!brick) return;

    const body = world.getRigidBody(brick.handle);
    if (!body) return;

    const translation = body.translation();
    const offset = {
      x: pointer.x - translation.x,
      y: pointer.y - translation.y,
    };

    dragStateRef.current = {
      brickId,
      pointerId: event.pointerId,
      offset,
      lastPosition: { x: translation.x, y: translation.y },
      lastTimestamp: event.timeStamp,
      velocity: { x: 0, y: 0 },
    };

    body.setLinvel({ x: 0, y: 0 }, true);
    body.setAngvel(0, true);
    body.wakeUp();

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  // Update the brick while dragging and keep the throw velocity in sync with pointer motion.
  const handlePointerMove = (
    brickId: string,
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const dragState = dragStateRef.current;
    if (
      dragState.brickId !== brickId ||
      dragState.pointerId !== event.pointerId
    ) {
      return;
    }

    const world = worldRef.current;
    if (!world) return;

    const pointer = computePointerPosition(event.clientX, event.clientY);
    if (!pointer) return;

    const brick = bricksRef.current.find((item) => item.id === brickId);
    if (!brick) return;

    const body = world.getRigidBody(brick.handle);
    if (!body) return;

    const target = {
      x: pointer.x - dragState.offset.x,
      y: pointer.y - dragState.offset.y,
    };

    const now = event.timeStamp;
    let velocity = dragState.velocity;
    if (dragState.lastPosition) {
      const dt = (now - dragState.lastTimestamp) / 1000;
      if (dt > 0) {
        velocity = {
          x: (target.x - dragState.lastPosition.x) / dt,
          y: (target.y - dragState.lastPosition.y) / dt,
        };
      }
    } else {
      velocity = { x: 0, y: 0 };
    }

    const updatedState: DragState = {
      ...dragState,
      lastPosition: { x: target.x, y: target.y },
      lastTimestamp: now,
      velocity,
    };
    dragStateRef.current = updatedState;

    body.setTranslation(target, true);
    body.setLinvel({ x: 0, y: 0 }, true);
    body.setAngvel(0, true);
    event.preventDefault();
  };

  // Release the brick when the pointer lifts or cancels.
  const finishDrag = (
    brickId: string,
    pointerId: number,
    target: HTMLDivElement
  ) => {
    const dragState = dragStateRef.current;
    if (dragState.brickId !== brickId || dragState.pointerId !== pointerId) {
      return;
    }

    const velocity = dragState.velocity;
    dragStateRef.current = resetDragState();

    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }

    const world = worldRef.current;
    if (!world) return;

    const brick = bricksRef.current.find((item) => item.id === brickId);
    if (!brick) return;

    const body = world.getRigidBody(brick.handle);
    if (!body) return;

    body.setLinvel(velocity, true);
    body.wakeUp();
  };

  const handlePointerUp = (
    brickId: string,
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    finishDrag(brickId, event.pointerId, event.currentTarget);
    event.preventDefault();
  };

  const handlePointerCancel = (
    brickId: string,
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    finishDrag(brickId, event.pointerId, event.currentTarget);
    event.preventDefault();
  };

  const renderBrick = (brick: VisualBrick) => {
    const isText = brick.type === "text";
    const style: React.CSSProperties = {
      width: `${brick.width}px`,
      height: `${brick.height}px`,
      transform: `translate(${brick.x - brick.width / 2}px, ${
        brick.y - brick.height / 2
      }px) rotate(${brick.angle}rad)`,
    };

    if (isText) {
      style.backgroundColor = "white";
      style.borderColor = brick.color;
      style.color = brick.color;
    } else {
      style.backgroundColor = brick.color;
    }

    return (
      <div
        key={brick.id}
        className={`absolute top-0 left-0 flex px-2 items-center w-full justify-center text-center rounded-md shadow-lg font-sans text-sm select-none ${
          isText ? "border" : "text-white"
        }`}
        style={style}
        onPointerDown={(event) => handlePointerDown(brick.id, event)}
        onPointerMove={(event) => handlePointerMove(brick.id, event)}
        onPointerUp={(event) => handlePointerUp(brick.id, event)}
        onPointerCancel={(event) => handlePointerCancel(brick.id, event)}
      >
        {brick.text}
      </div>
    );
  };

  const brickPairs = new Map<
    string,
    { text?: VisualBrick; number?: VisualBrick }
  >();
  for (const brick of bricks) {
    const entry = brickPairs.get(brick.pairId) ?? {};
    if (brick.type === "text") {
      entry.text = brick;
    } else {
      entry.number = brick;
    }
    brickPairs.set(brick.pairId, entry);
  }

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
      {Array.from(brickPairs.entries()).map(([pairId, pair]) => (
        <React.Fragment key={pairId}>
          {pair.text && renderBrick(pair.text)}
          {pair.number && renderBrick(pair.number)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FallingBricks;
