"use client";

import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownContentProps {
  source: string;
}

// Dynamically import to avoid SSR issues and match editor preview behavior
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export default function MarkdownContent({ source }: MarkdownContentProps) {
  return (
    <div
      data-color-mode="light"
      className="prose prose-lg prose-slate dark:prose-invert mx-auto max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-3xl md:prose-h1:text-4xl
        prose-h2:text-2xl md:prose-h2:text-3xl
        prose-h3:text-xl md:prose-h3:text-2xl
        prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
        prose-li:text-base md:prose-li:text-lg
        prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:italic
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal
        prose-pre:bg-muted prose-pre:border prose-pre:border-border
        prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto
        prose-strong:font-bold prose-strong:text-foreground
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
    >
      <MarkdownPreview source={source || ""} rehypePlugins={[[rehypeSanitize]]} />
    </div>
  );
}

