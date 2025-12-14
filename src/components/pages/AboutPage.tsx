import { Link } from 'react-router-dom';

/**
 * Editorial About Page
 * Biography with drop cap, portrait, timeline of achievements
 */
export const AboutPage = () => {
    return (
        <div className="min-h-screen">
            {/* ============================================
          HERO SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16">
                <div className="max-w-luxury mx-auto">
                    {/* Decorative Line */}
                    <div className="decorative-line mb-8" />

                    {/* Overline */}
                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-6">
                        The Composer
                    </p>

                    {/* Page Title */}
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight-luxury mb-12">
                        Ulvin <em className="text-gold">Najafov</em>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-warmGrey text-xl md:text-2xl max-w-2xl leading-relaxed">
                        Contemporary classical composer bridging Romantic tradition
                        with modern musical expression.
                    </p>
                </div>
            </section>

            {/* ============================================
          BIOGRAPHY SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 border-t border-charcoal/10">
                <div className="max-w-luxury mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-16">
                        {/* Portrait */}
                        <div className="md:col-span-5 md:col-start-1">
                            <div className="relative aspect-[3/4] overflow-hidden shadow-luxury-lg group">
                                <div className="w-full h-full bg-taupe flex items-center justify-center">
                                    <span className="font-serif text-9xl text-charcoal/10">UN</span>
                                </div>
                                {/* Inner Border */}
                                <div className="absolute inset-0 shadow-inner-border pointer-events-none" />
                                {/* Vertical Label */}
                                <div className="absolute left-4 bottom-8 hidden lg:block">
                                    <p className="vertical-text text-micro uppercase tracking-editorial text-warmGrey">
                                        Composer / Pianist
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Biography Text */}
                        <div className="md:col-span-6 md:col-start-7">
                            <p className="text-micro uppercase tracking-editorial text-warmGrey mb-8">
                                Biography
                            </p>

                            <div className="prose prose-lg">
                                <p className="text-lg leading-relaxed mb-6 drop-cap">
                                    Ulvin Najafov is a contemporary classical composer whose work seamlessly
                                    weaves the emotional depth of the Romantic era with modern compositional
                                    techniques. His catalog spans orchestral symphonies, intimate piano works,
                                    chamber music, and evocative film scores.
                                </p>

                                <p className="text-warmGrey leading-relaxed mb-6">
                                    Born with an innate passion for music, Najafov began his compositional
                                    journey at an early age, drawing inspiration from the great masters—Chopin,
                                    Rachmaninoff, and Tchaikovsky—while developing his own distinctive voice.
                                    His compositions are characterized by lush harmonies, memorable melodies,
                                    and a profound emotional resonance that speaks to listeners across cultures.
                                </p>

                                <p className="text-warmGrey leading-relaxed mb-6">
                                    The composer's notable works include the "Grand Waltzes" collection—a
                                    monumental set of 24 piano waltzes exploring every major and minor key—and
                                    the "L'Inconnue" series, twelve evocative nocturnes that journey through
                                    the mysterious landscapes of night.
                                </p>

                                <p className="text-warmGrey leading-relaxed">
                                    His orchestral works, including the Piano Concerto No. 1 in E minor and
                                    Symphony No. 1 in C Minor, demonstrate a masterful command of orchestration
                                    and form, earning recognition for their dramatic scope and emotional intensity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
          PHILOSOPHY SECTION (Dark)
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 bg-taupe dark:bg-charcoal text-charcoal dark:text-alabaster">
                <div className="max-w-luxury mx-auto">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-micro uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 mb-8">
                            Artistic Philosophy
                        </p>

                        <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-12">
                            "Music is the <em className="text-gold">language</em> of emotions that words
                            cannot express. Each note is a brushstroke on the canvas of silence."
                        </blockquote>

                        <div className="decorative-line mx-auto" />
                    </div>
                </div>
            </section>

            {/* ============================================
          NOTABLE WORKS SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 border-t border-charcoal/10">
                <div className="max-w-luxury mx-auto">
                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-8">
                        Notable Works
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Work Categories */}
                        {[
                            {
                                title: 'Grand Waltzes',
                                description: '24 piano waltzes exploring every key',
                                count: '24 pieces',
                            },
                            {
                                title: "L'Inconnue",
                                description: 'Twelve mysterious nocturnes for piano',
                                count: '12 pieces',
                            },
                            {
                                title: 'Piano Concerto No. 1',
                                description: 'Three-movement concerto in E minor',
                                count: '34 min',
                            },
                            {
                                title: 'Symphony No. 1',
                                description: 'Four-movement symphony in C minor',
                                count: '37 min',
                            },
                            {
                                title: 'Chamber Works',
                                description: 'String quartets, violin sonatas, cello pieces',
                                count: '15+ pieces',
                            },
                            {
                                title: 'Film & Dramatic',
                                description: 'Orchestral works for cinema',
                                count: '5+ scores',
                            },
                        ].map((category, index) => (
                            <article
                                key={category.title}
                                className="border-t border-charcoal pt-8 hover:bg-taupe/30 transition-colors duration-500 p-4 -m-4"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <p className="text-micro uppercase tracking-editorial text-warmGrey mb-2">
                                    {category.count}
                                </p>
                                <h3 className="font-serif text-2xl md:text-3xl mb-3">
                                    {category.title}
                                </h3>
                                <p className="text-warmGrey text-sm">
                                    {category.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
          CTA SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 bg-taupe">
                <div className="max-w-luxury mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
                                Explore the <em className="text-gold">Catalog</em>
                            </h2>
                            <p className="text-warmGrey max-w-lg">
                                Discover the full collection of compositions, from solo piano
                                works to grand orchestral pieces.
                            </p>
                        </div>
                        <Link to="/works" className="btn-primary self-start">
                            <span className="btn-bg" />
                            <span className="btn-text">Browse Works</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
