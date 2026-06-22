import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useReadingProgress } from "../../lib/hooks";

/**
 * Top-level page frame: fixed reading-progress bar, persistent sidebar, main
 * content, and an optional right rail. When `rail` is omitted the grid drops to
 * two columns.
 */
export function Layout({ children, rail }: { children: ReactNode; rail?: ReactNode }) {
  const progress = useReadingProgress();
  return (
    <>
      <div className="progress" style={{ width: `${progress * 100}%` }} />
      <div className={`layout${rail ? "" : " no-rail"}`}>
        <Sidebar />
        <main>{children}</main>
        {rail}
      </div>
    </>
  );
}
