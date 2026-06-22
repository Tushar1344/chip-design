import type { ReactNode } from "react";

interface CalloutProps {
  label?: string;
  children: ReactNode;
}

/** Teal aside box for key insights / "the big idea" moments. */
export function Callout({ label = "Key idea", children }: CalloutProps) {
  return (
    <aside className="callout">
      <div className="callout-label">{label}</div>
      {children}
    </aside>
  );
}
