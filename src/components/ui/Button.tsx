import { ButtonProps } from '@/types';
import { cn } from '@/utils/cn';

/**
 * Editorial Button Component
 * Primary variant has gold sliding animation on hover
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) => {
  if (variant === 'primary') {
    return (
      <button
        className={cn(
          'btn-primary',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className="btn-bg" />
        <span className="btn-text">{children}</span>
      </button>
    );
  }

  return (
    <button
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        'transition-all duration-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const variantStyles = {
  primary: '', // Handled separately above
  secondary: 'btn-secondary',
  ghost: 'text-charcoal hover:text-gold text-xs uppercase tracking-editorial font-medium',
};

const sizeStyles = {
  sm: 'h-10 px-6 text-xs',
  md: 'h-12 px-8 text-xs',
  lg: 'h-14 px-10 text-xs',
};
