import { PortableText, type PortableTextComponents } from "@portabletext/react";
import React from "react";

import { urlFor } from "../../sanity/lib/image";

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
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
      const src = urlFor(value).width(1600).quality(85).url();

      if (!src) {
        return null;
      }

      return (
        <div className="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
          <img
            src={src}
            alt={value?.alt || ""}
            className="h-auto w-full object-cover"
          />
        </div>
      );
    },
  },
};

type PortableRichTextProps = {
  value?: unknown[];
};

export default function PortableRichText({ value }: PortableRichTextProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="rich-text">
      <PortableText value={value} components={components} />
    </div>
  );
}