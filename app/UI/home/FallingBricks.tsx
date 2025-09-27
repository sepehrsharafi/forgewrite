import dynamic from "next/dynamic";

// Dynamically import the client-side component and disable Server-Side Rendering (SSR)
const FallingBricksClient = dynamic(() => import("./FallingBricksClient"), {
  ssr: false,
});

export default FallingBricksClient;
