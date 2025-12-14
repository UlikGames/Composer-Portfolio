import { Link, useLocation } from 'react-router-dom';
import { NavLinkProps } from '@/types';
import { cn } from '@/utils/cn';

/**
 * Editorial NavLink Component
 */
export const NavLink = ({
  to,
  children,
  className,
  onClick,
  variant = 'default',
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'transition-colors duration-500',
        variant === 'default' && [
          'text-xs uppercase tracking-editorial font-medium',
          isActive ? 'text-charcoal' : 'text-warmGrey hover:text-charcoal',
        ],
        variant === 'menu' && [
          'font-serif text-3xl',
          isActive ? 'text-charcoal' : 'text-warmGrey hover:text-charcoal',
        ],
        className
      )}
    >
      {children}
    </Link>
  );
};
