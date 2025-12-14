// ============================================
// DOMAIN TYPES
// ============================================

export interface Work {
  id: string;
  title: string;
  year: number;
  duration: number | string; // in minutes (number) or formatted string (e.g., "02:22")
  artist?: string; // Primary artist(s) credited for the work
  instrumentation: string[];
  tags: string[];
  audioUrl?: string;
  scoreUrl?: string;
  scores?: Array<{
    title: string;
    url: string;
  }>;
  scoreAvailability?: 'free' | 'request';
  imageUrl?: string; // Full-size image (poster) for detail page
  thumbnailUrl?: string; // Thumbnail image for catalog/card view (optional, falls back to imageUrl)
  performanceNote?: string; // Extra note about availability, rentals, or requests
  isFeatured?: boolean;
  movements?: Array<{
    title: string;
    duration?: string;
    audioUrl?: string;
  }>;
}

export interface SiteConfig {
  composerName: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  heroImage?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

// ============================================
// UI COMPONENT PROPS
// ============================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'menu';
}

export interface LogoProps {
  className?: string;
  size?: number;
}

// ============================================
// FEATURE COMPONENT PROPS
// ============================================

export interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
}

export interface WorkCardProps {
  work: Work;
  onPlay?: (work: Work) => void;
  onViewScore?: (work: Work) => void;
  className?: string;
}

export interface FilterBarProps {
  instrumentationFilters: string[];
  tagFilters: string[];
  activeInstrumentation: string[];
  activeTags: string[];
  onInstrumentationChange: (filters: string[]) => void;
  onTagChange: (filters: string[]) => void;
}

export interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  isSubmitting?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  ensemble: string;
  desiredDate: string;
  performanceContext: string;
  technicalNeeds: string;
}

export interface ThemeToggleProps {
  className?: string;
}

// ============================================
// LAYOUT COMPONENT PROPS
// ============================================

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FooterProps {
  className?: string;
}

// ============================================
// THEME CONTEXT
// ============================================

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ============================================
// FILTER STATE
// ============================================

export interface FilterState {
  instrumentation: string[];
  tags: string[];
}

export type FilterAction =
  | { type: 'SET_INSTRUMENTATION'; payload: string[] }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'RESET' };
