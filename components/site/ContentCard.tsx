import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

import { urlFor } from "../../sanity/lib/image";
import type { SanityImage } from "../../sanity/lib/types";
import { createFadeUp, motionEase, useSiteReducedMotion, viewportSettings } from "./motion";

type ContentCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  tags?: string[];
  image?: SanityImage;
  href?: string;
  children?: React.ReactNode;
};

function isExternalLink(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:");
}

export default function ContentCard({
  eyebrow,
  title,
  description,
  meta,
  tags,
  image,
  href,
  children,
}: ContentCardProps) {
  const shouldReduceMotion = useSiteReducedMotion();
  const imageUrl = image ? urlFor(image).width(1200).height(720).fit("crop").url() : null;
  const TitleElement = href ? (
    isExternalLink(href) ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-amber-200"
      >
        {title}
      </a>
    ) : (
      <Link href={href} className="hover:text-amber-200">
        {title}
      </Link>
    )
  ) : (
    title
  );

  return (
    <motion.article
      className="panel group overflow-hidden p-5 will-change-transform"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={viewportSettings}
      variants={shouldReduceMotion ? undefined : createFadeUp(18)}
      whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.01 }}
      transition={{ duration: 0.28, ease: motionEase }}
    >
      {imageUrl ? (
        <motion.div
          className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60"
          transition={{ duration: 0.45, ease: motionEase }}
        >
          <Image
            src={imageUrl}
            alt={image?.alt || title}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
        </motion.div>
      ) : null}

      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

      <div className="space-y-3">
        <div className="space-y-2">
          {meta ? <p className="text-sm text-slate-500">{meta}</p> : null}
          <h3 className="text-2xl font-semibold tracking-tight text-slate-50">
            {TitleElement}
          </h3>
          {description ? (
            <p className="text-sm leading-7 text-slate-400">{description}</p>
          ) : null}
        </div>

        {tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {children ? <div className="flex flex-wrap gap-3 pt-2">{children}</div> : null}
      </div>
    </motion.article>
  );
}