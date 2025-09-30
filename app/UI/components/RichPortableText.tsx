import { PortableText, type PortableTextReactComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import clsx from "clsx";

const portableTextComponents: PortableTextReactComponents = {
  block: {
    normal: ({ children }) => (
      <p className="whitespace-pre-line text-base leading-7 text-[#4E4E4E] 2xl:text-xl">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-semibold text-[#2D3142] 2xl:text-4xl">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-[#2D3142] 2xl:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-[#2D3142] 2xl:text-2xl">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#4D4E69] pl-4 italic text-[#4E4E4E]">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6 text-[#4E4E4E] 2xl:text-xl">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6 text-[#4E4E4E] 2xl:text-xl">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#2D3142]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline decoration-2 underline-offset-4">{children}</span>,
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-sm text-[#2D3142]">{children}</code>
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
};

export interface RichPortableTextProps {
  value?: PortableTextBlock[];
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
