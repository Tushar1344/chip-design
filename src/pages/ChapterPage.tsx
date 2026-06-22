import { Link, Navigate, useParams } from "react-router-dom";
import { Layout } from "../components/book/Layout";
import { Rail } from "../components/book/Rail";
import { chapters, chapterIndex } from "../content/chapters";
import { useScrollTopOnRouteChange } from "../lib/hooks";

export function ChapterPage() {
  const { slug = "" } = useParams();
  useScrollTopOnRouteChange(slug);

  const idx = chapterIndex(slug);
  if (idx === -1) return <Navigate to="/" replace />;

  const chapter = chapters[idx];
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const { Component } = chapter;

  return (
    <Layout
      rail={
        <Rail
          sections={chapter.sections}
          meta={{ Chapter: `${chapter.num} of ${chapters.length}`, Part: chapter.part }}
        />
      }
    >
      <article className="article">
        <p className="article-eyebrow">{chapter.part}</p>
        <h1 className="article-title">{chapter.title}</h1>
        <div className="article-meta">
          <span>Chapter {chapter.num}</span>
          <span>{chapter.tag}</span>
        </div>
        <div className="prose">
          <Component />
        </div>

        <nav className="chapter-nav">
          {prev ? (
            <Link to={`/chapter/${prev.slug}`}>
              <div className="dir">← Previous</div>
              <div className="ch-name">{prev.title}</div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="next" to={`/chapter/${next.slug}`}>
              <div className="dir">Next →</div>
              <div className="ch-name">{next.title}</div>
            </Link>
          ) : (
            <Link className="next" to="/">
              <div className="dir">Back to →</div>
              <div className="ch-name">Cover</div>
            </Link>
          )}
        </nav>
      </article>
    </Layout>
  );
}
