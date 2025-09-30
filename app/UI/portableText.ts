import type { PortableTextBlock } from "@portabletext/types";

export interface PortableImageBlock {
  _key: string;
  _type: "image";
  asset?: {
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

export type PortableRichTextBlock = PortableTextBlock | PortableImageBlock;
