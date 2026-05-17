'use client';

import { motion, Variants } from 'framer-motion';
import ModularContactForm from "@/components/contact/ModularContactForm";
import Navbar from "@/components/layout/Navbar";

export default function ContactClient() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen pt-24 sm:pt-32 pb-16 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-[color:var(--neon)]/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                className="section-container max-w-6xl relative z-10 !pt-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="mb-12 sm:mb-16">
                    <motion.div variants={itemVariants} className="v-tag mb-7">Side B · Open Studio</motion.div>
                    <motion.h1
                        variants={itemVariants}
                        className="font-serif font-light leading-[0.92] tracking-tight mb-6 text-[clamp(48px,9vw,128px)]"
                    >
                        Get In <em className="not-italic font-black text-[color:var(--neon)]">Touch</em>
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg max-w-2xl text-[color:var(--text-secondary)] opacity-80 leading-relaxed"
                    >
                        Have a project in mind, a song request, or just want to say hi? I&apos;m always open to new opportunities and interesting conversations.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <motion.div variants={itemVariants} className="lg:col-span-7 professional-card p-6 sm:p-8 md:p-10">
                        <ModularContactForm initialType="GENERAL" />
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
                        {/* Direct Email Card */}
                        <div className="professional-card p-7 sm:p-8 group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-11 h-11 bg-[color:var(--neon)]/10 border border-[color:var(--neon)]/30 flex items-center justify-center text-[color:var(--neon)]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] font-bold">Direct Line</h3>
                            </div>
                            <div className="space-y-3">
                                <a href="mailto:suvojeet@suvojeetsengupta.in" className="flex items-center justify-between gap-4 group/link py-1">
                                    <span className="font-serif text-sm sm:text-base text-[color:var(--text-secondary)] group-hover/link:text-[color:var(--neon)] transition-colors break-all">suvojeet@suvojeetsengupta.in</span>
                                    <svg className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all text-[color:var(--neon)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                                <div className="h-px bg-[color:var(--line)]" />
                                <a href="mailto:support@suvojeetsengupta.in" className="flex items-center justify-between gap-4 group/link py-1">
                                    <span className="font-serif text-sm sm:text-base text-[color:var(--text-secondary)] group-hover/link:text-[color:var(--neon)] transition-colors break-all">support@suvojeetsengupta.in</span>
                                    <svg className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all text-[color:var(--neon)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Response Time Card */}
                        <div className="professional-card p-7 sm:p-8">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-11 h-11 bg-[color:var(--neon)]/10 border border-[color:var(--neon)]/30 flex items-center justify-center text-[color:var(--neon)]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] font-bold">Response Time</h3>
                            </div>
                            <p className="text-sm sm:text-base text-[color:var(--text-secondary)] opacity-80 leading-relaxed">
                                I typically respond within <span className="text-[color:var(--neon)] italic font-semibold">24–48 hours</span>. Provide as much detail as you can.
                            </p>
                        </div>

                        {/* Process Card */}
                        <div className="professional-card p-7 sm:p-8">
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] font-bold mb-7">What to Expect</h3>
                            <div className="space-y-5">
                                {[
                                    { step: '01', title: 'Selection', desc: 'Choose the relevant category for your inquiry.' },
                                    { step: '02', title: 'Detailing', desc: 'Provide necessary information and your message.' },
                                    { step: '03', title: 'Review', desc: 'I personally review every message and respond via email.' }
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4">
                                        <span className="font-serif italic font-black text-2xl text-[color:var(--neon)]/30 leading-none flex-shrink-0">{item.step}</span>
                                        <div className="space-y-1">
                                            <h4 className="font-serif text-base font-semibold">{item.title}</h4>
                                            <p className="text-sm text-[color:var(--text-secondary)] opacity-75 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
