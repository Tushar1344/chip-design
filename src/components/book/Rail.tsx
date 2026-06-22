import type { Section } from "../../content/chapters";
import { useActiveSection } from "../../lib/hooks";

/** Right-rail "On this page" table of contents with scroll-spy highlighting. */
export function Rail({ sections, meta }: { sections: Section[]; meta?: Record<string, string> }) {
  const active = useActiveSection(sections.map((s) => s.id));

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <aside className="rail">
      <p className="rail-label">On this page</p>
      <nav className="toc">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              go(s.id);
            }}
          >
            {s.label}
          </a>
        ))}
      </nav>
      {meta && (
        <div className="rail-meta" style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
          {Object.entries(meta).map(([k, v]) => (
            <div key={k}>
              <span className="rail-label" style={{ margin: 0 }}>
                {k}
              </span>
              <div style={{ color: "var(--ink)" }}>{v}</div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
