import type { ReactNode } from "react";

interface FigureProps {
  /** figure number, e.g. "1.2" */
  n?: string;
  caption?: ReactNode;
  children: ReactNode;
  /** drop the bordered card (e.g. for full-bleed media) */
  bare?: boolean;
}

/**
 * Bordered "paper" figure card with a centred mono caption — the avianna
 * figure convention ("Fig. N · ..."). Used to frame every simulation/diagram.
 */
export function Figure({ n, caption, children, bare = false }: FigureProps) {
  return (
    <figure className="figure">
      <div className={bare ? "" : "figure-card"}>{children}</div>
      {caption && (
        <figcaption className="figcaption">
          {n && (
            <>
              <span className="fig-n">Fig. {n}</span>
              {"  ·  "}
            </>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
