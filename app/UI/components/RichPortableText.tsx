import Image from "next/image";
import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import type {
  PortableImageBlock,
  ProjectPortableTextBlock,
} from "@/lib/sanity/projects";
import clsx from "clsx";

type RichPortableTextValue = ProjectPortableTextBlock[];

function resolveImageDimensions(image?: PortableImageBlock["asset"]): {
  width: number;
  height: number;
} {
  const dimensions = image?.metadata?.dimensions;
  const fallbackWidth = 1200;
  const fallbackHeight = 800;

  if (!dimensions) {
    return { width: fallbackWidth, height: fallbackHeight };
  }

  const width = Math.max(1, Math.round(dimensions.width ?? fallbackWidth));
  const height = (() => {
    if (dimensions.height) {
      return Math.max(1, Math.round(dimensions.height));
    }

    if (dimensions.aspectRatio && dimensions.aspectRatio > 0) {
      return Math.max(1, Math.round(width / dimensions.aspectRatio));
    }

    return fallbackHeight;
  })();

  return { width, height };
}

const portableTextComponents: PortableTextReactComponents = {
  block: {
    normal: ({ children }) => (
      <p className="whitespace-pre-line text-base leading-7 text-[#4E4E4E] 2xl:text-xl">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-semibold text-[#2D3142] 2xl:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-[#2D3142] 2xl:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-[#2D3142] 2xl:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#4D4E69] pl-4 italic text-[#4E4E4E]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6 text-[#4E4E4E] 2xl:text-xl">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6 text-[#4E4E4E] 2xl:text-xl">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#2D3142]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline decoration-2 underline-offset-4">
        {children}
      </span>
    ),
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-sm text-[#2D3142]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = /^https?:\/\//i.test(href);

      return (
        <a
          href={href}
          className="text-[#4D4E69] underline underline-offset-4 transition-colors duration-150 hover:text-[#2D3142]"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const imageValue = value as PortableImageBlock;
      const src = imageValue.asset?.url;

      if (!src) {
        return null;
      }

      const { width, height } = resolveImageDimensions(imageValue.asset);
      const alt = imageValue.alt?.trim() || "Project illustration";
      const caption = imageValue.caption?.trim();

      return (
        <figure className="my-6 overflow-hidden rounded-sm bg-neutral-50 p-3 xl:mx-5 2xl:mx-20">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="mx-auto h-auto w-full rounded-sm object-cover"
            sizes="(min-width: 1280px) 960px, 100vw"
          />
          {caption ? (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export interface RichPortableTextProps {
  value?: RichPortableTextValue;
  className?: string;
}

export function RichPortableText({ value, className }: RichPortableTextProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
