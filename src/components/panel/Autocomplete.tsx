import { useId, useState, type FocusEvent, type KeyboardEvent } from "react";
import { inputClass } from "./ui";

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Called when a suggestion is picked. Defaults to onChange. */
  onSelect?: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  ariaLabel?: string;
  /** Runs first for keys the list does not use (Enter with nothing highlighted, commas...). */
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const MAX_SHOWN = 8;

/** Text input with a suggestion list (ARIA 1.2 combobox: arrows, Enter, Esc). */
export function Autocomplete({ id, value, onChange, onSelect, suggestions, placeholder, maxLength, disabled, ariaLabel, onKeyDown, onBlur }: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = value.trim().toLowerCase();
  const matches = suggestions.filter((s) => s.toLowerCase() !== query && (!query || s.toLowerCase().includes(query))).slice(0, MAX_SHOWN);
  const visible = open && matches.length > 0;
  const activeIndex = visible && active < matches.length ? active : -1;

  function pick(item: string) {
    (onSelect ?? onChange)(item);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!matches.length) return;
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(e.key === "ArrowDown" ? 0 : matches.length - 1);
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + matches.length) % matches.length);
      return;
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      pick(matches[activeIndex]);
      return;
    }
    if (e.key === "Escape" && visible) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      return;
    }
    onKeyDown?.(e);
  }

  return (
    <div className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={visible}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        autoComplete="off"
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          setOpen(false);
          onBlur?.(e);
        }}
        onKeyDown={handleKeyDown}
        className={inputClass}
      />
      {visible && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-theme bg-card py-1 shadow-theme"
        >
          {matches.map((item, i) => (
            <li
              key={item}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              // mousedown (not click) so the input keeps focus and onBlur doesn't close the list first
              onMouseDown={(e) => {
                e.preventDefault();
                pick(item);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-2 text-sm ${i === activeIndex ? "bg-theme text-accent" : "text-theme"}`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
