import { Link } from "react-router-dom";
import { Layout } from "../components/book/Layout";
import { chapters } from "../content/chapters";

export function Home() {
  return (
    <Layout>
      <div className="home">
        <section className="hero">
          <p className="eyebrow">Interactive book</p>
          <h1>Chip Design From the Bottom Up</h1>
          <p className="hero-tagline">
            Build an AI accelerator from first principles — start with a single transistor as a
            switch, and work up to the systolic array at the heart of every TPU. Every idea is a
            live simulation you can poke.
          </p>
          <div className="hero-meta">
            <div className="meta-item">
              <strong>After</strong>
              <span>Dwarkesh Patel × Reiner Pope</span>
            </div>
            <div className="meta-item">
              <strong>Format</strong>
              <span>Interactive · LaTeX · video demos</span>
            </div>
            <div className="meta-item">
              <strong>Reading</strong>
              <span>~45 min + tinkering</span>
            </div>
          </div>
        </section>

        <div className="chapter-list">
          {chapters.map((c) => (
            <Link key={c.slug} className="chapter-row" to={`/chapter/${c.slug}`}>
              <span className="ch-num">{c.num.padStart(2, "0")}</span>
              <span className="ch-body">
                <span className="ch-name">{c.title}</span>
                <span className="ch-blurb">{c.blurb}</span>
              </span>
              <span className="ch-tag">{c.tag}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
