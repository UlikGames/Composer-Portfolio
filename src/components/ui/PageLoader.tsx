/**
 * Editorial Page Loader
 * Elegant music-themed loading animation for route transitions
 */
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-alabaster dark:bg-charcoal transition-colors duration-300">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Music Bars */}
        <div className="flex items-end gap-1 h-16">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-gold to-gold/60 rounded-full"
              style={{
                animation: 'musicBar 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
                height: '100%',
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="text-center">
          <p className="font-serif text-3xl text-charcoal dark:text-alabaster tracking-wide">
            <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>U</span>
            <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>l</span>
            <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>v</span>
            <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>i</span>
            <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>n</span>
            <span className="opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}> </span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>N</span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>a</span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>j</span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>a</span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>f</span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>o</span>
            <span className="opacity-0 animate-fade-in text-gold" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>v</span>
          </p>

          {/* Decorative Line */}
          <div className="mt-4 mx-auto overflow-hidden">
            <div
              className="h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              style={{
                width: '120px',
                animation: 'expandLine 1.5s ease-out forwards',
                animationDelay: '0.5s',
                transform: 'scaleX(0)',
              }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-micro uppercase tracking-editorial text-warmGrey animate-pulse">
          Loading Compositions...
        </p>
      </div>

      {/* Custom Keyframes */}
      <style>{`
        @keyframes musicBar {
          0%, 100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }
        @keyframes expandLine {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

