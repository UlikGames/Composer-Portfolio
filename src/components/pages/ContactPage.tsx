import { useState } from 'react';

/**
 * Editorial Contact Page
 * Contact form with underline inputs, commission information
 */
export const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen">
            {/* ============================================
          HEADER SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16">
                <div className="max-w-luxury mx-auto">
                    {/* Decorative Line */}
                    <div className="decorative-line mb-8" />

                    {/* Overline */}
                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-6">
                        Get in Touch
                    </p>

                    {/* Page Title */}
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight-luxury mb-8">
                        Let's <em className="text-gold">Connect</em>
                    </h1>

                    {/* Description */}
                    <p className="text-warmGrey text-lg md:text-xl max-w-2xl leading-relaxed">
                        Interested in commissioning a new work, licensing existing compositions,
                        or discussing a collaboration? I'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* ============================================
          CONTACT FORM SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 border-t border-charcoal/10">
                <div className="max-w-luxury mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-16">
                        {/* Form */}
                        <div className="md:col-span-7">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-micro uppercase tracking-editorial text-warmGrey mb-4"
                                    >
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                        className="editorial-input"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-micro uppercase tracking-editorial text-warmGrey mb-4"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                        className="editorial-input"
                                    />
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-micro uppercase tracking-editorial text-warmGrey mb-4"
                                    >
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="editorial-input cursor-pointer"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="commission">Commission a New Work</option>
                                        <option value="licensing">Licensing Inquiry</option>
                                        <option value="performance">Performance Request</option>
                                        <option value="score">Score Request</option>
                                        <option value="collaboration">Collaboration</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-micro uppercase tracking-editorial text-warmGrey mb-4"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell me about your project or inquiry..."
                                        required
                                        rows={6}
                                        className="editorial-input h-auto resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="btn-bg" />
                                        <span className="btn-text">
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </span>
                                    </button>
                                </div>

                                {/* Status Messages */}
                                {submitStatus === 'success' && (
                                    <p className="text-gold text-sm">
                                        Thank you for your message! I'll get back to you soon.
                                    </p>
                                )}
                                {submitStatus === 'error' && (
                                    <p className="text-red-600 text-sm">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Contact Info Sidebar */}
                        <div className="md:col-span-4 md:col-start-9">
                            <div className="sticky top-32 space-y-12">
                                {/* Email */}
                                <div>
                                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-4">
                                        Email
                                    </p>
                                    <a
                                        href="mailto:contact@ulvin.oguzlu@gmail.com"
                                        className="font-serif text-xl link-interactive text-charcoal dark:text-alabaster"
                                    >
                                        ulvin.oguzlu@gmail.com
                                    </a>
                                </div>

                                {/* Social */}
                                <div>
                                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-4">
                                        Follow
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href="https://musescore.com/user/41748651"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-interactive text-charcoal dark:text-alabaster"
                                        >
                                            Musescrore
                                        </a>
                                        <a
                                            href="https://open.spotify.com/user/1swb2wzs1183zklymc4ox9t0k"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-interactive text-charcoal dark:text-alabaster"
                                        >
                                            Spotify
                                        </a>
                                    </div>
                                </div>

                                {/* Response Time */}
                                <div>
                                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-4">
                                        Response Time
                                    </p>
                                    <p className="text-warmGrey text-sm leading-relaxed">
                                        I typically respond within 2-3 business days. For urgent
                                        inquiries, please mention it in your message.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
