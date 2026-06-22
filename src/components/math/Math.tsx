import { useMemo } from "react";
import katex from "katex";

interface MathProps {
  children: string;
  /** block (display) vs inline rendering */
  block?: boolean;
}

/**
 * Render a LaTeX string with KaTeX. KaTeX is bundled locally (no CDN), so this
 * works offline. Inline by default; pass `block` for centred display math.
 */
export function Math({ children, block = false }: MathProps) {
  const html = useMemo(
    () =>
      katex.renderToString(children, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      }),
    [children, block],
  );

  const Tag = block ? "div" : "span";
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Convenience alias for display math. */
export function BlockMath({ children }: { children: string }) {
  return <Math block>{children}</Math>;
}
