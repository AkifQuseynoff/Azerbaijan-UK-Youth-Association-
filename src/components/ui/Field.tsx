import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-ink transition-colors placeholder:text-mute/60 hover:border-brand-sky/50 focus:border-brand-sky";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

type FieldProps = { label: string; hint?: string };

/** Label + input pair with the label programmatically linked to the control. */
export function Field({ label, hint, className, ...input }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={className ?? inputClass} {...input} />
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-mute">{hint}</p>}
    </>
  );
}

export function TextAreaField({ label, hint, className, ...input }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <textarea id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={className ?? `${inputClass} resize-y`} {...input} />
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-mute">{hint}</p>}
    </>
  );
}

export function SelectField({
  label,
  hint,
  options,
  placeholder,
  className,
  ...select
}: FieldProps & { options: readonly string[]; placeholder?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <select id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={className ?? inputClass} {...select}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-mute">{hint}</p>}
    </>
  );
}
