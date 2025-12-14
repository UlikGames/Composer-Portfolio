import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
    SectionWrapperProps,
    SectionHeaderProps,
    spacing,
    colors
} from '@/types/design-tokens';

/**
 * SectionWrapper Component
 * Provides consistent padding, background variants, and border styling for page sections.
 * 
 * @example
 * <SectionWrapper variant="accent" borderTop>
 *   <SectionHeader title="Featured" titleAccent="Works" />
 *   {content}
 * </SectionWrapper>
 */
export const SectionWrapper = ({
    children,
    className,
    variant = 'default',
    id,
    padding = 'md',
    borderTop = false,
}: SectionWrapperProps) => {
    const variantStyles = {
        default: 'bg-alabaster dark:bg-charcoal text-charcoal dark:text-alabaster',
        accent: 'bg-taupe dark:bg-charcoalLight text-charcoal dark:text-alabaster',
        dark: 'bg-charcoal dark:bg-charcoalLight text-alabaster',
    };

    return (
        <section
            id={id}
            className={cn(
                spacing.section[padding],
                spacing.container,
                variantStyles[variant],
                borderTop && `border-t ${colors.border.default}`,
                className
            )}
        >
            <div className="max-w-luxury mx-auto">
                {children}
            </div>
        </section>
    );
};

/**
 * SectionHeader Component
 * Provides consistent header styling with overline, title (with optional accent), 
 * description, and optional action link.
 * 
 * @example
 * <SectionHeader 
 *   overline="Selected Works"
 *   title="Featured"
 *   titleAccent="Compositions"
 *   action={{ label: "View All →", href: "/works" }}
 * />
 */
export const SectionHeader = ({
    overline,
    title,
    titleAccent,
    description,
    action,
    alignment = 'left',
    className,
}: SectionHeaderProps) => {
    const alignmentStyles = {
        left: 'text-left',
        center: 'text-center mx-auto',
    };

    return (
        <div
            className={cn(
                'mb-12 md:mb-16',
                alignment === 'left' && action && 'flex flex-col md:flex-row md:items-end md:justify-between gap-6',
                alignmentStyles[alignment],
                className
            )}
        >
            <div className={alignment === 'center' ? 'max-w-2xl mx-auto' : ''}>
                {overline && (
                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-4 md:mb-6">
                        {overline}
                    </p>
                )}

                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
                    {title}
                    {titleAccent && (
                        <>
                            {' '}
                            <em className="text-gold">{titleAccent}</em>
                        </>
                    )}
                </h2>

                {description && (
                    <p className="text-warmGrey text-lg leading-relaxed max-w-xl">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <Link
                    to={action.href}
                    className={cn(
                        'text-xs uppercase tracking-editorial link-interactive self-start md:self-end shrink-0',
                        'text-charcoal dark:text-alabaster'
                    )}
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
};

/**
 * DecorativeLine Component
 * A simple decorative horizontal line used in editorial layouts.
 */
export const DecorativeLine = ({ className }: { className?: string }) => (
    <div className={cn('decorative-line', className)} />
);
