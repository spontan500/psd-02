/* Shared UI: form fields, buttons, modal shell, tabs */

const { useState, useRef, useEffect, useMemo } = React;

function Field({ label, required, children, hint, error, className = "" }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label>
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>
      )}
      {children}
      {error ? <span className="err">{error}</span> : hint ? <span className="help">{hint}</span> : null}
    </div>
  );
}

function DateInput({ value, onChange, placeholder = "TT.MM.JJJJ", invalid }) {
  // value is "DD.MM.YYYY"; native input uses "YYYY-MM-DD"
  const inputRef = useRef(null);
  const toIso = (s) => {
    if (!s) return "";
    const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
  };
  const fromIso = (s) => {
    if (!s) return "";
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
  };
  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else el.focus();
  };
  return (
    <div className={`date-input ${value ? "" : "is-empty"}`}>
      <input
        ref={inputRef}
        type="date"
        value={toIso(value)}
        onChange={(e) => onChange && onChange(fromIso(e.target.value))}
        className={`input ${invalid ? "is-invalid" : ""}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="date-input-icon"
        tabIndex={-1}
        aria-label="Kalender öffnen"
        onClick={openPicker}
      >
        <IconCalendar size={20} />
      </button>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", invalid, ...rest }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      className={`input ${invalid ? "is-invalid" : ""}`}
      {...rest}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, invalid, autoGrow, minRows, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!autoGrow) return;
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value, autoGrow]);
  return (
    <textarea
      ref={ref}
      value={value ?? ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows || rows}
      className={`textarea ${invalid ? "is-invalid" : ""}`}
      style={autoGrow ? { resize: "none", overflow: "hidden" } : undefined}
      {...rest}
    />
  );
}

function Select({ value, onChange, options = [], placeholder = "Auswählen", invalid }) {
  const empty = !value;
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`select ${invalid ? "is-invalid" : ""} ${empty ? "is-empty" : ""}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={value === v}
            className={value === v ? "active" : ""}
            onClick={() => onChange && onChange(v)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

function Button({ children, variant = "primary", size = "md", onClick, type = "button", icon, disabled, ...rest }) {
  const cls = `btn btn-${variant} ${size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : ""}`;
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {icon}
      {children}
    </button>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <span className="box" aria-hidden="true">
        {checked && <IconCheck size={12} stroke="white" strokeWidth={3} />}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

function CollapseSection({ title, defaultOpen = true, right, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        className={`section-head ${open ? "" : "collapsed"}`}
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {right && <span style={{ marginLeft: 12, fontWeight: 500, fontSize: 13, color: "var(--text-soft)" }}>{right}</span>}
        <span className="arrow">
          <IconChevronDown size={20} />
        </span>
      </button>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

/* Modal shell with header + scrollable body + footer. */
function Modal({ title, subtitle, onClose, onBeforeClose, footer, children, maxWidth = 1792, headerRight, defaultFullscreen = false, autofocus = true }) {
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);
  const shellRef = useRef(null);
  const bodyRef = useRef(null);

  const requestClose = () => {
    if (onBeforeClose) {
      const ok = onBeforeClose();
      if (ok === false) return;
    }
    onClose && onClose();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (fullscreen) {
        setFullscreen(false);
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      requestClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen, onBeforeClose, onClose]);

  // Autofocus first focusable element in body when modal opens
  useEffect(() => {
    if (!autofocus) return;
    const t = setTimeout(() => {
      const root = bodyRef.current;
      if (!root) return;
      const sel = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const el = root.querySelector(sel);
      if (el) el.focus();
      else shellRef.current?.focus();
    }, 220);
    return () => clearTimeout(t);
  }, []);

  // Focus trap — keep Tab within modal
  useEffect(() => {
    const root = shellRef.current;
    if (!root) return;
    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const sel = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
      const focusable = [...root.querySelectorAll(sel)].filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className={`modal-overlay ${fullscreen ? "is-fullscreen" : ""}`}
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div className="modal-shell" tabIndex={-1} ref={shellRef} style={{ maxWidth: fullscreen ? "none" : maxWidth }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <div className="modal-title">
            <span>{title}</span>
            {subtitle && <><span className="sep">|</span><span className="subtitle">{subtitle}</span></>}
          </div>
          <div className="right">
            {headerRight}
            <button className="kbd" title={fullscreen ? "Verkleinern (Esc)" : "Vollbild"} onClick={() => setFullscreen(!fullscreen)}>
              <IconExpand size={14} />
            </button>
            <button className="kbd" title="Schliessen (Esc)" onClick={requestClose}>
              <IconX size={14} />
            </button>
          </div>
        </div>
        <div className="modal-body" ref={bodyRef}>{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* Toast — auto-dismiss */
function Toast({ message, onDone, icon = <IconCheck size={16} /> }) {
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="toast" role="status">
      <span style={{ color: "var(--success-strong)" }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

/* Filter pill (Übersicht style) */
function FilterPill({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="filter-pill" onClick={() => setOpen(!open)}>
        <span className="key">{label}:</span>
        <span>{value || "Alle"}</span>
        <IconChevronDown size={16} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: "white", border: "1px solid var(--border)",
          borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          padding: 6, minWidth: 200, zIndex: 20,
        }}>
          {["Alle", ...options].map((o) => (
            <button
              key={o}
              onClick={() => { onChange && onChange(o === "Alle" ? "" : o); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 10px", borderRadius: 6, fontWeight: 500,
                fontSize: 13, color: "var(--text-default)",
                background: (value === o || (!value && o === "Alle")) ? "var(--bg-field-soft)" : "transparent",
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Simple validation helpers */
function validatePerson(values) {
  const errs = {};
  if (!values.name?.trim()) errs.name = "Name ist erforderlich";
  if (!values.vorname?.trim()) errs.vorname = "Vorname ist erforderlich";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Ungültige E-Mail";
  if (values.mobile && !/^[+0-9 ()\-]{6,}$/.test(values.mobile)) errs.mobile = "Ungültige Nummer";
  return errs;
}

function ConfirmDialog({ title, message, confirmLabel = "Verwerfen", cancelLabel = "Weiter bearbeiten", danger = true, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onCancel && onCancel(); };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onCancel]);
  return (
    <div className="modal-overlay" style={{ zIndex: 80 }} onClick={(e) => e.target === e.currentTarget && onCancel && onCancel()}>
      <div className="modal-shell" style={{ width: 440, maxWidth: 440 }}>
        <div style={{ padding: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
          <div style={{ color: "var(--text-soft)", fontSize: 14, lineHeight: 1.5 }}>{message}</div>
        </div>
        <div className="modal-footer">
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? "primary" : "primary"} onClick={onConfirm} style={danger ? { background: "var(--danger)" } : null}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Field, Input, DateInput, Textarea, Select, Segmented, Button, Checkbox, CollapseSection,
  Modal, Toast, ConfirmDialog, FilterPill, validatePerson,
});
