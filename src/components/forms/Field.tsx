import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputBase =
  "block w-full rounded-sm border border-ink/20 bg-ivory-50 px-4 text-[1rem] text-ink placeholder:text-ink-soft/80 transition-colors focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-[#9B2C2C]";

export function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-4 text-sm font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-ink-soft">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[#9B2C2C]">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type Common = { id: string; label: string; error?: string; hint?: string; optional?: boolean; className?: string };

export const TextField = forwardRef<HTMLInputElement, Common & InputHTMLAttributes<HTMLInputElement>>(
  ({ id, label, error, hint, optional, className, ...rest }, ref) => (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(inputBase, "h-12")}
        {...rest}
      />
    </FieldShell>
  )
);
TextField.displayName = "TextField";

export const SelectField = forwardRef<HTMLSelectElement, Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }>(
  ({ id, label, error, hint, optional, className, options, placeholder = "Select…", ...rest }, ref) => (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(inputBase, "h-12 appearance-none pr-10")}
          defaultValue=""
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-ink-muted">
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
    </FieldShell>
  )
);
SelectField.displayName = "SelectField";

export const TextAreaField = forwardRef<HTMLTextAreaElement, Common & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ id, label, error, hint, optional, className, ...rest }, ref) => (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(inputBase, "min-h-[120px] py-3")}
        {...rest}
      />
    </FieldShell>
  )
);
TextAreaField.displayName = "TextAreaField";

/** Visually hidden spam trap. */
export const Honeypot = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
    <label>
      Leave this field empty
      <input ref={ref} tabIndex={-1} autoComplete="off" {...props} />
    </label>
  </div>
));
Honeypot.displayName = "Honeypot";
