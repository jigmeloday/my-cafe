import { cn } from '@/lib/utils';
import { Eye, EyeClosed } from 'lucide-react';

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

function Input({
  className,
  type,
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Input + Eye wrapper */}
      <div className="relative w-full">
        <input
          type={type}
          data-slot="input"
          className={cn(
            "h-12 w-full focus-visible:ring-[0.5px] focus-visible:ring-primary-50 rounded-md border bg-transparent px-3 text-base outline-none",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
          >
            {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export { Input };
