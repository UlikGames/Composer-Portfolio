import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial Footer Component
 * Dark section with newsletter signup and social links
 */
export const Footer = forwardRef<HTMLElement>((_, ref) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const currentYear = new Date().getFullYear();

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Thanks for subscribing!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    return (
        <footer
            ref={ref}
            className="bg-taupe dark:bg-charcoal text-charcoal dark:text-alabaster py-20 md:py-32 border-t border-charcoal/10 dark:border-alabaster/10"
            role="contentinfo"
        >
            <div className="max-w-luxury mx-auto px-8 md:px-16">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand & Description */}
                    <div className="md:col-span-5">
                        <Link
                            to="/"
                            className="font-serif text-3xl md:text-4xl tracking-tight text-charcoal dark:text-alabaster hover:text-gold transition-colors duration-500 block mb-6"
                        >
                            Ulvin Najafov
                        </Link>
                        <p className="text-charcoal/60 dark:text-alabaster/60 text-sm leading-relaxed max-w-sm">
                            Mechanical engineering student and classical composer/pianist. This is my portfolio
                            of scores, recordings, and works-in-progress — built with structure, contrast, and emotion.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-3 md:col-start-7">
                        <h4 className="text-xs uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 mb-6">
                            Navigation
                        </h4>
                        <nav className="flex flex-col gap-4" aria-label="Footer navigation">
                            <Link to="/" className="text-sm text-charcoal/80 dark:text-alabaster/80 link-interactive">
                                Home
                            </Link>
                            <Link to="/works" className="text-sm text-charcoal/80 dark:text-alabaster/80 link-interactive">
                                Works
                            </Link>
                            <Link to="/about" className="text-sm text-charcoal/80 dark:text-alabaster/80 link-interactive">
                                About
                            </Link>
                            <Link to="/contact" className="text-sm text-charcoal/80 dark:text-alabaster/80 link-interactive">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-4">
                        <h4 className="text-xs uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 mb-6">
                            Updates
                        </h4>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email for new releases"
                                className="flex-1 h-12 px-0 py-2 bg-transparent border-b border-charcoal/30 dark:border-alabaster/30 text-charcoal dark:text-alabaster text-sm placeholder:font-serif placeholder:italic placeholder:text-charcoal/40 dark:placeholder:text-alabaster/40 focus:outline-none focus:border-gold transition-colors duration-500"
                                required
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                className="btn-primary h-12 px-6 text-xs uppercase tracking-luxury"
                                disabled={status === 'loading'}
                            >
                                <span className="btn-bg" />
                                <span className="btn-text">{status === 'loading' ? 'Sending...' : 'Subscribe'}</span>
                            </button>
                        </form>
                        {message && (
                            <p className={`text-sm mt-3 ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-charcoal/10 dark:border-alabaster/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Copyright */}
                    <p className="text-micro uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60">
                        © {currentYear} Ulvin Najafov. Scores & recordings for portfolio use.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-8">
                        <a
                            href="https://musescore.com/user/41748651"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 link-interactive"
                        >
                            Musescore
                        </a>
                        <a
                            href="https://open.spotify.com/user/1swb2wzs1183zklymc4ox9t0k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 link-interactive"
                        >
                            Spotify
                        </a>
                        <a
                            href="mailto:ulvin.oguzlu@gmail.com"
                            className="text-xs uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 link-interactive"
                        >
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';
