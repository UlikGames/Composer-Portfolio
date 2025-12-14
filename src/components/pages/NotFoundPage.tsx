import { Link } from 'react-router-dom';

/**
 * Editorial 404 Not Found Page
 */
export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 sm:px-10 md:px-16">
      <div className="text-center max-w-xl">
        {/* Decorative Line */}
        <div className="decorative-line mx-auto mb-8" />

        {/* 404 */}
        <p className="font-serif text-8xl md:text-9xl text-charcoal/10 mb-4">
          404
        </p>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl mb-6">
          Page Not <em className="text-gold">Found</em>
        </h1>

        {/* Description */}
        <p className="text-warmGrey text-lg leading-relaxed mb-12">
          The page you're looking for seems to have wandered off into
          the silence between notes. Let's guide you back to the music.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <span className="btn-bg" />
            <span className="btn-text">Return Home</span>
          </Link>
          <Link to="/works" className="btn-secondary">
            Explore Works
          </Link>
        </div>
      </div>
    </div>
  );
};
