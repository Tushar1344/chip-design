import { useEffect, useRef, useState } from "react";
import { Figure } from "../book/Figure";

interface VideoDemoProps {
  /** composition id; matches public/compositions/<id>/index.html and public/videos/<id>.mp4 */
  id: string;
  n?: string;
  caption?: React.ReactNode;
  /** intrinsic aspect ratio for the live-HTML fallback frame */
  ratio?: number;
}

/**
 * Plays a rendered MP4 (public/videos/<id>.mp4) when it exists; otherwise
 * falls back to the live HyperFrames HTML composition in an iframe. This keeps
 * demos working in-sandbox (no Chrome → no MP4) and upgrades automatically once
 * the CI render job has produced the video files.
 */
export function VideoDemo({ id, n, caption, ratio = 16 / 9 }: VideoDemoProps) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const mp4 = `${base}/videos/${id}.mp4`;
  const html = `${base}/compositions/${id}/index.html`;

  const [hasMp4, setHasMp4] = useState<boolean | null>(null);
  const [frameH, setFrameH] = useState<number | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Probe for the rendered MP4 with a HEAD request.
  useEffect(() => {
    let alive = true;
    fetch(mp4, { method: "HEAD" })
      .then((r) => alive && setHasMp4(r.ok))
      .catch(() => alive && setHasMp4(false));
    return () => {
      alive = false;
    };
  }, [mp4]);

  // Auto-resize the fallback iframe via postMessage from the composition.
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.source === frameRef.current?.contentWindow && e.data?.type === "embed-height") {
        setFrameH(e.data.height);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div className="video-demo">
      <Figure n={n} caption={caption}>
        {hasMp4 === null ? (
          <div style={{ aspectRatio: String(ratio), background: "var(--panel-2)" }} />
        ) : hasMp4 ? (
          <video src={mp4} controls loop muted playsInline preload="metadata" />
        ) : (
          <iframe
            ref={frameRef}
            src={html}
            title={`demo: ${id}`}
            loading="lazy"
            style={{ height: frameH ?? undefined, aspectRatio: frameH ? undefined : String(ratio) }}
          />
        )}
      </Figure>
      {hasMp4 === false && (
        <span className="embed-badge">live composition · MP4 renders in CI</span>
      )}
    </div>
  );
}
