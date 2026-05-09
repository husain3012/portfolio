import React from "react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="panel max-w-3xl px-6 py-8">
      <p className="eyebrow">Empty</p>
      <h2 className="section-heading">{title}</h2>
      <p className="mt-4 section-copy">{description}</p>
    </div>
  );
}