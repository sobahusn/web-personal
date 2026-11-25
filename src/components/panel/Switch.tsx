import { useId } from "react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Switch({ checked, onChange, label, description }: Props) {
  const labelId = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p id={labelId} className="text-sm font-medium text-theme">
          {label}
        </p>
        {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-theme transition-colors input-focus ${checked ? "bg-accent" : "bg-card"}`}
      >
        <span
          className={`absolute top-0.5 h-[18px] w-[18px] rounded-full shadow transition-all ${checked ? "left-[22px] bg-white" : "left-0.5 bg-[color:var(--text-muted)]"}`}
        />
      </button>
    </div>
  );
}
