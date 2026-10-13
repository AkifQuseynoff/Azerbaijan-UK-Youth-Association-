import { useId } from "react";
import { inputClass } from "./Field";

const STEP = 15; // minutes between choices in the time list
const TIMES = Array.from({ length: (24 * 60) / STEP }, (_, i) => {
  const m = i * STEP;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
});

/**
 * Date and time as two plain controls: a date picker and a list of times in the 24-hour format.
 * The browser's own "date and time" box is hard to use on many phones (and shows AM/PM), so this works the same everywhere.
 * `value` and `onChange` use "YYYY-MM-DDTHH:mm" in the viewer's own timezone, or "" when empty.
 */
export default function DateTimeField({
  label,
  value,
  onChange,
  defaultTime = "18:00",
  optional = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  /** The time that is filled in when a date is chosen first. */
  defaultTime?: string;
  optional?: boolean;
  hint?: string;
}) {
  const id = useId();
  const date = value.slice(0, 10);
  const time = value.length >= 16 ? value.slice(11, 16) : "";
  const options = time && !TIMES.includes(time) ? [...TIMES, time].sort() : TIMES;

  return (
    <div>
      <span id={`${id}-l`} className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] gap-2" role="group" aria-labelledby={`${id}-l`}>
        <input
          type="date"
          aria-label={`${label}: date`}
          className={inputClass}
          value={date}
          onChange={(e) => onChange(e.target.value ? `${e.target.value}T${time || defaultTime}` : "")}
        />
        <select
          aria-label={`${label}: time`}
          className={inputClass}
          value={time}
          disabled={!date}
          onChange={(e) => date && onChange(`${date}T${e.target.value}`)}
        >
          {!time && <option value="">Time</option>}
          {options.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="mt-1 flex items-center justify-between gap-3">
        {hint ? <p className="text-xs text-mute">{hint}</p> : <span />}
        {optional && value && (
          <button type="button" onClick={() => onChange("")} className="text-xs font-semibold text-brand-blue underline underline-offset-4">Clear</button>
        )}
      </div>
    </div>
  );
}
