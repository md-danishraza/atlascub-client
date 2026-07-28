"use client";

interface HtmlContentProps {
  html: string;
  className?: string;
}

export function HtmlContent({ html, className = "" }: HtmlContentProps) {
  if (!html) return null;
  console.log(html)
  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}