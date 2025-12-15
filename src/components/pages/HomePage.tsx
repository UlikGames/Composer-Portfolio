import { Link } from 'react-router-dom';
import { works } from '@/data/worksData';
import { SplineScene } from '@/components/ui/SplineScene';

/**
 * Editorial HomePage
 * Dramatic hero, about teaser
 */
export const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* ============================================
          HERO SECTION
          ============================================ */}
            <section
                className="relative flex items-center py-16 md:py-24 px-6 sm:px-10 md:px-16 border-b border-charcoal/10 dark:border-alabaster/10"
                style={{ minHeight: 'calc(100dvh - 80px)' }}
            >
                <div className="max-w-luxury mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    {/* Text Column */}
                    <div className="lg:col-span-6 max-w-xl">
                        <div className="decorative-line mb-8 animate-fade-in" />

                        {/* Overline */}
                        <p className="text-micro uppercase tracking-editorial text-warmGrey mb-6 animate-fade-in-delay-1">
                            Mechanical Engineering Student • Composer & Pianist
                        </p>

                        {/* Hero Headline with Mixed Italics */}
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight-luxury mb-8 animate-fade-in-delay-2">
                            <span className="block">Engineering</span>
                            <span className="block">
                                <em className="text-gold">Emotion</em> Into Music
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-warmGrey text-lg md:text-xl leading-relaxed mb-12 animate-fade-in-delay-3">
                            By day I study mechanics, materials, and motion — by night I write contemporary
                            classical works: orchestral sketches, chamber pieces, and piano music shaped by
                            structure, contrast, and atmosphere.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-4">
                            <Link to="/works" className="btn-primary">
                                <span className="btn-bg" />
                                <span className="btn-text">Explore Works</span>
                            </Link>
                            <Link to="/about" className="btn-secondary">
                                About Me
                            </Link>
                        </div>
                    </div>

                    {/* 3D Piano Spline Embed */}
                    <div className="lg:col-span-6 w-full h-full flex justify-center">
                        <div
                            className="relative rounded-2xl overflow-hidden border border-charcoal/10 dark:border-alabaster/10 shadow-luxury-lg bg-alabaster/40 dark:bg-charcoal/40 backdrop-blur-sm aspect-[4/3] md:aspect-square w-full max-w-2xl"
                            style={{ maxHeight: '70vh' }}
                        >
                            <SplineScene
                                sceneUrl="https://prod.spline.design/nS0qpYNbauJjjF9A/scene.splinecode"
                                className="absolute inset-0"
                            />
                        </div>
                    </div>
                </div>

                {/* Vertical Text (Desktop Only) */}
                <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2">
                    <p className="vertical-text text-micro uppercase tracking-editorial text-warmGrey">
                        Portfolio / Est. 2024
                    </p>
                </div>

                {/* Scroll Cue */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 flex flex-col items-center gap-3 text-warmGrey/80 animate-fade-in-delay-4">
                    {/* Mouse Icon with animated scroll wheel */}
                    <div className="relative w-6 h-10 border-2 border-current rounded-full flex justify-center">
                        <div className="w-1 h-2.5 bg-current rounded-full mt-2 animate-mouse-wheel" />
                    </div>

                    {/* Bouncing Chevron */}
                    <svg
                        className="w-5 h-5 animate-bounce-slow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>

                    {/* Text */}
                    <span className="text-[10px] uppercase tracking-[0.3em] font-light">Scroll</span>
                </div>
            </section>

            {/* ============================================
          ABOUT TEASER SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 bg-taupe dark:bg-charcoal text-charcoal dark:text-alabaster">
                <div className="max-w-luxury mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-8 items-center">
                        {/* Text Content */}
                        <div className="md:col-span-7 md:col-start-1">
                            <p className="text-micro uppercase tracking-editorial text-charcoal/60 dark:text-alabaster/60 mb-6">
                                The Story
                            </p>
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                                Where <em className="text-gold">Design</em> Meets Sound
                            </h2>
                            <p className="text-charcoal/70 dark:text-alabaster/70 text-lg leading-relaxed mb-8 max-w-xl drop-cap">
                                I’m a mechanical engineering student with a parallel life in music — writing
                                classical compositions and performing at the piano. I’m drawn to forms that feel
                                inevitable: themes that return like mechanisms, harmonies that tension and release
                                like springs, and textures built with the same care as a blueprint.
                            </p>
                            <Link to="/about" className="btn-primary">
                                <span className="btn-bg" />
                                <span className="btn-text">Read More</span>
                            </Link>
                        </div>

                        {/* Decorative Element */}
                        <div className="hidden md:block md:col-span-4 md:col-start-9">
                            <div className="aspect-[3/4] border border-charcoal/20 dark:border-alabaster/20 flex items-center justify-center">
                                <span className="font-serif text-8xl text-charcoal/10 dark:text-alabaster/10">UN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
          STATISTICS SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 border-t border-charcoal/10 dark:border-alabaster/10">
                <div className="max-w-luxury mx-auto">
                    <div className="grid grid-cols-3 gap-8 md:gap-12">
                        <div className="text-center">
                            <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal dark:text-alabaster mb-2">
                                {works.length}+
                            </p>
                            <p className="text-micro uppercase tracking-editorial text-warmGrey">
                                Works Published
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal dark:text-alabaster mb-2">
                                40+
                            </p>
                            <p className="text-micro uppercase tracking-editorial text-warmGrey">
                                Waltzes & Miniatures
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal dark:text-alabaster mb-2">
                                10+
                            </p>
                            <p className="text-micro uppercase tracking-editorial text-warmGrey">
                                Large-Form Pieces
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
