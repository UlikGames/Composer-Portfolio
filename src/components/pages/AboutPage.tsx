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
                        Mechanical Engineering Student • Composer & Pianist
                    </p>

                    {/* Page Title */}
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight-luxury mb-12">
                        Ulvin <em className="text-gold">Najafov</em>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-warmGrey text-xl md:text-2xl max-w-2xl leading-relaxed">
                        I study machines and motion — and write contemporary classical music built with
                        structure, atmosphere, and feeling.
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
                                <div className="w-full h-full bg-taupe dark:bg-charcoal/50 flex items-center justify-center">
                                    <span className="font-serif text-9xl text-charcoal/10 dark:text-alabaster/10">UN</span>
                                </div>
                                {/* Inner Border */}
                                <div className="absolute inset-0 shadow-inner-border pointer-events-none" />
                                {/* Vertical Label */}
                                <div className="absolute left-4 bottom-8 hidden lg:block">
                                    <p className="vertical-text text-micro uppercase tracking-editorial text-warmGrey">
                                        Engineering / Music
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
                                    I’m Ulvin Najafov — a mechanical engineering student who also composes and
                                    performs contemporary classical music. I’m fascinated by how the same ideas
                                    show up in both worlds: tension and release, balance, symmetry, resonance,
                                    and the way small details shape the whole.
                                </p>

                                <p className="text-warmGrey leading-relaxed mb-6">
                                    My musical language sits close to the Romantic tradition — lyric melody,
                                    rich harmony, clear storytelling — but I try to frame it with modern pacing
                                    and texture. I’m drawn to pieces that feel “designed”: themes that return
                                    with purpose, harmonies that bend under pressure, and climaxes that arrive
                                    like a mechanism finally locking into place.
                                </p>

                                <p className="text-warmGrey leading-relaxed mb-6">
                                    Most of my work lives at the piano, where sketches become miniatures,
                                    waltzes, nocturnes, and larger forms. From there, some pieces expand outward
                                    into chamber writing and orchestral color — always with the same goal: make
                                    something emotionally direct, but structurally honest.
                                </p>

                                <p className="text-warmGrey leading-relaxed">
                                    This site is my portfolio — a curated catalog of scores, recordings, and
                                    projects in progress. If you’d like to collaborate, perform a piece, or just
                                    talk music, feel free to reach out.
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
                            "I write music like I design mechanisms: with <em className="text-gold">clarity</em>,
                            tension, and release — so emotion has a structure to live inside."
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
                        Highlights
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Piano Works',
                                description: 'Waltzes, nocturnes, preludes, and larger-form pieces',
                                count: '40+ pieces',
                            },
                            {
                                title: 'Grand Waltzes',
                                description: 'A growing set of waltzes shaped around key, color, and motion',
                                count: 'Series',
                            },
                            {
                                title: 'Nocturnes',
                                description: 'Night pieces focused on harmony, stillness, and long melody',
                                count: 'Series',
                            },
                            {
                                title: 'Chamber Writing',
                                description: 'Works for strings and mixed ensembles, built from piano sketches',
                                count: 'In progress',
                            },
                            {
                                title: 'Orchestral Studies',
                                description: 'Themes and movements exploring orchestral color and form',
                                count: 'Sketchbook',
                            },
                            {
                                title: 'Film & Dramatic',
                                description: 'Cues and scenes written for narrative and atmosphere',
                                count: 'Projects',
                            },
                        ].map((category, index) => (
                            <article
                                key={category.title}
                                className="border-t border-charcoal dark:border-alabaster/20 pt-8 hover:bg-taupe/30 dark:hover:bg-charcoal/30 transition-colors duration-500 p-4 -m-4"
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
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 bg-taupe dark:bg-charcoal/80">
                <div className="max-w-luxury mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
                                Explore the <em className="text-gold">Catalog</em>
                            </h2>
                            <p className="text-warmGrey max-w-lg">
                                Browse scores and recordings — from intimate piano pieces to larger studies in
                                form and color.
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
