import React, { useEffect } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Loader2,
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
  Wifi,
  Wind,
  Tv,
  Mic,
  Car,
  UtensilsCrossed,
  Volume2,
  Zap,
  SquareCheck,
  Building,
  School,
  Sun,
  Layers,
  ChevronRight,
} from 'lucide-react';

// --- Facility Icon Mapper ---
export const getFacilityIcon = (facilityName = '') => {
  const name = facilityName.toLowerCase();
  if (name.includes('projector')) return Tv;
  if (name.includes('ac') || name.includes('air')) return Wind;
  if (name.includes('wi-fi') || name.includes('wifi')) return Wifi;
  if (name.includes('mic') || name.includes('microphone')) return Mic;
  if (name.includes('parking')) return Car;
  if (name.includes('kitchen')) return UtensilsCrossed;
  if (name.includes('sound') || name.includes('audio')) return Volume2;
  if (name.includes('power') || name.includes('backup')) return Zap;
  if (name.includes('whiteboard')) return SquareCheck;
  if (name.includes('stage')) return Layers;
  if (name.includes('wheelchair')) return Sun;
  return Sparkles;
};

// --- Space Type Pastel Badges / Icons ---
export const getSpaceTypeDetails = (type = '') => {
  switch (type) {
    case 'Community Hall':
      return { icon: Building, bg: 'bg-emerald-100/80', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'Society Clubhouse':
      return { icon: Building, bg: 'bg-indigo-100/80', text: 'text-indigo-800', border: 'border-indigo-200' };
    case 'Meeting Room':
      return { icon: Users, bg: 'bg-amber-100/80', text: 'text-amber-800', border: 'border-amber-200' };
    case 'Classroom':
      return { icon: School, bg: 'bg-sky-100/80', text: 'text-sky-800', border: 'border-sky-200' };
    case 'Terrace Hall':
      return { icon: Sun, bg: 'bg-orange-100/80', text: 'text-orange-800', border: 'border-orange-200' };
    default:
      return { icon: Layers, bg: 'bg-purple-100/80', text: 'text-purple-800', border: 'border-purple-200' };
  }
};

// --- Button ---
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'transition-all duration-150 font-medium select-none';

  let variantClass = 'clay-btn';
  if (variant === 'secondary') variantClass = 'clay-btn-secondary';
  if (variant === 'danger') variantClass = 'clay-btn-danger';
  if (variant === 'ghost') variantClass = 'clay-btn-ghost';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-[18px]',
    lg: 'px-7 py-3.5 text-base rounded-[20px]',
  }[size] || 'px-5 py-2.5 text-sm rounded-[18px]';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variantClass} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-1" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

// --- Input ---
export const Input = ({
  label,
  error,
  helper,
  icon: Icon,
  required = false,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-ink-soft flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-ink-soft/70 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          required={required}
          className={`clay-inset w-full py-2.5 ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none transition-all ${
            error ? 'border-danger/70 bg-red-50/50' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-danger font-medium">{error}</span>}
      {helper && !error && <span className="text-xs text-ink-soft/70">{helper}</span>}
    </div>
  );
};

// --- Select ---
export const Select = ({
  label,
  error,
  options = [],
  required = false,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-ink-soft flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`clay-inset w-full py-2.5 px-4 text-sm text-ink bg-transparent focus:outline-none cursor-pointer ${
          error ? 'border-danger/70 bg-red-50/50' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-ink">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger font-medium">{error}</span>}
    </div>
  );
};

// --- Textarea ---
export const Textarea = ({
  label,
  error,
  required = false,
  className = '',
  containerClassName = '',
  rows = 3,
  id,
  ...props
}) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={areaId} className="text-xs font-semibold text-ink-soft flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        required={required}
        className={`clay-inset w-full py-2.5 px-4 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none resize-none ${
          error ? 'border-danger/70 bg-red-50/50' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger font-medium">{error}</span>}
    </div>
  );
};

// --- Checkbox ---
export const Checkbox = ({
  label,
  description,
  checked = false,
  onChange,
  id,
  className = '',
  ...props
}) => {
  const boxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={boxId} className={`flex items-start gap-3 cursor-pointer select-none group ${className}`}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          id={boxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
            checked
              ? 'bg-primary text-white shadow-sm'
              : 'clay-inset bg-[#EAECFA] text-transparent group-hover:border-primary/50'
          }`}
        >
          <Check className={`w-3.5 h-3.5 transition-transform ${checked ? 'scale-100' : 'scale-0'}`} />
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-semibold text-ink">{label}</span>}
          {description && <span className="text-xs text-ink-soft">{description}</span>}
        </div>
      )}
    </label>
  );
};

// --- FacilityChips ---
export const FacilityChips = ({
  facilities = [],
  selectedIds = [],
  onChange,
  readonly = false,
  maxDisplay = 99,
}) => {
  const toggleFacility = (id) => {
    if (readonly || !onChange) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((fid) => fid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const visible = facilities.slice(0, maxDisplay);
  const remaining = facilities.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((fac) => {
        const isSelected = selectedIds.includes(fac.id);
        const Icon = getFacilityIcon(fac.name);

        if (readonly) {
          return (
            <span
              key={fac.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50/80 text-ink border border-indigo-100/80 shadow-xs"
            >
              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{fac.name}</span>
            </span>
          );
        }

        return (
          <button
            key={fac.id}
            type="button"
            onClick={() => toggleFacility(fac.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary text-white shadow-sm'
                : 'clay-inset bg-[#EAECFA] text-ink-soft hover:text-ink'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-ink-soft'}`} />
            <span>{fac.name}</span>
            {isSelected && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        );
      })}
      {readonly && remaining > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-ink-soft">
          +{remaining} more
        </span>
      )}
    </div>
  );
};

// --- Badge ---
export const Badge = ({
  variant = 'default', // 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'active' | 'inactive' | 'info'
  children,
  className = '',
}) => {
  const styles = {
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    active: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
    completed: 'bg-purple-100 text-purple-800 border-purple-300',
    inactive: 'bg-slate-200 text-slate-700 border-slate-300',
    entered: 'bg-teal-100 text-teal-800 border-teal-300',
    default: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  }[variant.toLowerCase()] || 'bg-indigo-100 text-indigo-800 border-indigo-200';

  const dotColor = {
    confirmed: 'bg-emerald-500',
    active: 'bg-emerald-500',
    pending: 'bg-amber-500',
    cancelled: 'bg-rose-500',
    completed: 'bg-purple-500',
    inactive: 'bg-slate-400',
    entered: 'bg-teal-500',
    default: 'bg-indigo-500',
  }[variant.toLowerCase()] || 'bg-indigo-500';

  return (
    <span
      className={`clay-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-opacity-40 uppercase tracking-wider ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {children}
    </span>
  );
};

// --- Modal ---
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/35 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`clay w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-surface relative z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-indigo-100/60 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-heading text-ink">{title}</h3>
            {subtitle && <p className="text-xs md:text-sm text-ink-soft mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-indigo-100/50 text-ink-soft hover:text-ink transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// --- ConfirmDialog ---
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDanger ? 'bg-rose-100 text-danger' : 'bg-amber-100 text-warning'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-indigo-100/60">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Toast ---
export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  const Icon = isError ? AlertTriangle : isInfo ? Info : Check;
  const bgClass = isError
    ? 'bg-rose-50 border-rose-200 text-rose-900'
    : isInfo
    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
    : 'bg-emerald-50 border-emerald-200 text-emerald-900';

  const iconBg = isError ? 'bg-danger text-white' : isInfo ? 'bg-primary text-white' : 'bg-success text-white';

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 max-w-md p-4 rounded-2xl clay shadow-lg border border-white transition-all animate-bounce-subtle"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm font-medium flex-1 text-ink">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-black/5"
        aria-label="Dismiss message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- Spinner ---
export const Spinner = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3 min-h-[220px]">
      <div className="w-12 h-12 rounded-full clay flex items-center justify-center bg-surface animate-spin">
        <Loader2 className="w-6 h-6 text-primary" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft animate-pulse">
        {message}
      </p>
    </div>
  );
};

// --- EmptyState ---
export const EmptyState = ({
  icon: Icon = Layers,
  title = 'No records found',
  description = 'There is nothing to display here right now.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 clay bg-surface/70 border border-white">
      <div className="w-16 h-16 rounded-3xl clay-bubble bg-indigo-50 text-primary flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold font-heading text-ink">{title}</h4>
      <p className="text-xs md:text-sm text-ink-soft max-w-md mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

// --- StatCard ---
export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary', // 'primary' | 'success' | 'warning' | 'accent'
}) => {
  const colorMap = {
    primary: 'bg-indigo-100 text-primary',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    accent: 'bg-orange-100 text-accent',
  }[color] || 'bg-indigo-100 text-primary';

  return (
    <div className="clay p-5 md:p-6 flex items-start justify-between bg-surface">
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
          {title}
        </span>
        <span className="text-2xl md:text-3xl font-extrabold font-heading text-ink">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-ink-soft/80 mt-1 flex items-center gap-1 font-medium">
            {subtitle}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl clay-bubble ${colorMap} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

// --- DataTable ---
export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'No data available in this table.',
}) => {
  if (isLoading) {
    return <Spinner message="Loading table records..." />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No Records" description={emptyMessage} />;
  }

  return (
    <div className="clay bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-indigo-50/70 border-b border-indigo-100/70 text-xs font-bold text-ink-soft uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-5 py-3.5 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100/50">
            {data.map((row, rIdx) => (
              <tr
                key={row[keyField] || rIdx}
                className="hover:bg-indigo-50/40 transition-colors"
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-5 py-4 whitespace-nowrap text-ink">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- PageHeader ---
export const PageHeader = ({ title, subtitle, action, backButton }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
      <div>
        {backButton && <div className="mb-2">{backButton}</div>}
        <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-ink tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-ink-soft mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};
