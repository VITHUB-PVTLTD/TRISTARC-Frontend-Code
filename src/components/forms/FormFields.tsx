import React from 'react';
import { type FieldError } from 'react-hook-form';
import { AlertCircle, Upload, X } from 'lucide-react';

// ─── Input Field ────────────────────────────────────────────
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, leftIcon, className = '', id, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="form-label">
          {label}
          {props.required && <span className="text-accent-red ml-1" aria-hidden>*</span>}
        </label>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tristarc-text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={fieldId}
            className={`form-input ${leftIcon ? 'pl-10' : ''} ${error ? 'border-accent-red focus:ring-accent-red/30 focus:border-accent-red' : ''} ${className}`}
            aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
            aria-invalid={!!error}
            {...props}
          />
        </div>
        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-tristarc-text-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${fieldId}-error`} className="form-error" role="alert">
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);
InputField.displayName = 'InputField';

// ─── Text Area ──────────────────────────────────────────────
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  hint?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, className = '', id, rows = 5, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="form-label">
          {label}
          {props.required && <span className="text-accent-red ml-1" aria-hidden>*</span>}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          className={`form-input resize-none ${error ? 'border-accent-red focus:ring-accent-red/30 focus:border-accent-red' : ''} ${className}`}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="form-error" role="alert">
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-tristarc-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

// ─── Select Field ────────────────────────────────────────────
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="form-label">
          {label}
          {props.required && <span className="text-accent-red ml-1" aria-hidden>*</span>}
        </label>
        <select
          ref={ref}
          id={fieldId}
          className={`form-input ${error ? 'border-accent-red' : ''} ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="form-error" role="alert">
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);
SelectField.displayName = 'SelectField';

// ─── File Upload ─────────────────────────────────────────────
interface FileUploadProps {
  label: string;
  error?: FieldError;
  accept?: string;
  hint?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  error,
  accept = '.pdf,.doc,.docx',
  hint = 'PDF, DOC, DOCX (Max 5MB)',
  value,
  onChange,
  required,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange?.(file);
  };

  const handleClear = () => {
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5">
      <label className="form-label">
        {label}
        {required && <span className="text-accent-red ml-1" aria-hidden>*</span>}
      </label>
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary-light">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{value.name}</p>
            <p className="text-xs text-tristarc-text-muted">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-tristarc-text-muted hover:text-accent-red transition-colors"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${error ? 'border-accent-red bg-accent-red-light' : 'border-tristarc-border bg-tristarc-bg hover:border-primary hover:bg-primary-light'}`}
        >
          <Upload size={24} className={error ? 'text-accent-red' : 'text-tristarc-text-muted'} />
          <div className="text-center">
            <span className="text-sm font-medium text-primary">Click to upload</span>
            <span className="text-sm text-tristarc-text-muted"> or drag & drop</span>
          </div>
          <p className="text-xs text-tristarc-text-muted">{hint}</p>
          <input
            id="file-upload"
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={handleChange}
          />
        </label>
      )}
      {error && (
        <p className="form-error" role="alert">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
};
