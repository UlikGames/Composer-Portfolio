import { ReactNode } from 'react';

// ============================================
// SECTION COMPONENT PROPS
// ============================================

export interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'accent' | 'dark';
    id?: string;
    padding?: 'sm' | 'md' | 'lg';
    borderTop?: boolean;
}

export interface SectionHeaderProps {
    overline?: string;
    title: string;
    titleAccent?: string;
    description?: string;
    action?: {
        label: string;
        href: string;
    };
    alignment?: 'left' | 'center';
    className?: string;
}

// ============================================
// DESIGN TOKENS
// ============================================

export const spacing = {
    section: {
        sm: 'py-12 md:py-20',
        md: 'py-20 md:py-32',
        lg: 'py-24 md:py-40',
    },
    container: 'px-6 sm:px-10 md:px-16',
} as const;

export const typography = {
    overline: 'text-micro uppercase tracking-editorial',
    heading1: 'font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight-luxury',
    heading2: 'font-serif text-3xl md:text-4xl lg:text-5xl',
    heading3: 'font-serif text-2xl md:text-3xl',
    body: 'text-lg leading-relaxed',
    bodySmall: 'text-sm leading-relaxed',
} as const;

export const colors = {
    text: {
        primary: 'text-charcoal dark:text-alabaster',
        muted: 'text-warmGrey',
        accent: 'text-gold',
    },
    background: {
        default: 'bg-alabaster dark:bg-charcoal',
        accent: 'bg-taupe dark:bg-charcoalLight',
        dark: 'bg-charcoal text-alabaster',
    },
    border: {
        default: 'border-charcoal/10 dark:border-alabaster/10',
        accent: 'border-charcoal/20 dark:border-alabaster/20',
    },
} as const;
