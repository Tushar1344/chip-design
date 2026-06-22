import type { ReactNode } from "react";

/** A mono uppercase pill button; `active` fills it with ink. */
export function SimButton({
  children,
  active,
  accent,
  onClick,
  disabled,
}: {
  children: ReactNode;
  active?: boolean;
  accent?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = ["sim-btn", active ? "active" : "", accent ? "accent" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/** Labelled range slider with a live numeric readout. */
export function SimSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="sim-field">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="val">{format ? format(value) : value}</span>
    </div>
  );
}

export function SimSpacer() {
  return <div className="sim-spacer" />;
}
