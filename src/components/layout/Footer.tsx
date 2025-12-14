import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial Footer Component
 * Dark section with newsletter signup and social links
 */
export const Footer = forwardRef<HTMLElement>((_, ref) => {
    const [email, setEmail] = useState('');
    const currentYear = new Date().getFullYear();

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Newsletter submission logic would go here
        console.log('Newsletter signup:', email);
        setEmail('');
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
                            Contemporary classical composer known for evocative orchestral works,
                            intimate chamber pieces, and expressive piano compositions.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-3 md:col-start-7">
                        <h4 className="text-xs uppercase tracking-editorial text-charcoal/40 dark:text-alabaster/40 mb-6">
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
                        <h4 className="text-xs uppercase tracking-editorial text-charcoal/40 dark:text-alabaster/40 mb-6">
                            Stay Updated
                        </h4>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                                className="flex-1 h-12 px-0 py-2 bg-transparent border-b border-charcoal/30 dark:border-alabaster/30 text-charcoal dark:text-alabaster text-sm placeholder:font-serif placeholder:italic placeholder:text-charcoal/40 dark:placeholder:text-alabaster/40 focus:outline-none focus:border-gold transition-colors duration-500"
                                required
                            />
                            <button
                                type="submit"
                                className="btn-primary h-12 px-6 text-xs uppercase tracking-luxury"
                            >
                                <span className="btn-bg" />
                                <span className="btn-text">Subscribe</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-charcoal/10 dark:border-alabaster/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Copyright */}
                    <p className="text-micro uppercase tracking-editorial text-charcoal/40 dark:text-alabaster/40">
                        © {currentYear} Ulvin Najafov. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-8">
                        <a
                            href="https://musescore.com/user/41748651"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-editorial text-charcoal/40 dark:text-alabaster/40 link-interactive"
                        >
                            Musescore
                        </a>
                        <a
                            href="https://open.spotify.com/playlist/0o3BYszvGDryo2oUaWysjP?si=832ba904c4674283"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-editorial text-charcoal/40 dark:text-alabaster/40 link-interactive"
                        >
                            Spotify
                        </a>
                        <a
                            href="mailto:contact@ulvin.oguzlu@gmail.com"
                            className="text-xs uppercase tracking-editorial text-charcoal/40 dark:text-alabaster/40 link-interactive"
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
