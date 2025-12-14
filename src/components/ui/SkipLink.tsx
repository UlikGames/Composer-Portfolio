/**
 * Editorial Skip Link for Accessibility
 */
export const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-charcoal focus:text-alabaster focus:text-xs focus:uppercase focus:tracking-editorial"
    >
      Skip to main content
    </a>
  );
};
