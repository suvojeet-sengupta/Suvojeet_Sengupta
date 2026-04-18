'use client';

import { motion, Variants } from 'framer-motion';
import ModularContactForm from "@/components/contact/ModularContactForm";

export default function ContactPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
        <div className="bg-background min-h-screen pt-32 pb-20 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div 
                className="section-container max-w-5xl relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="mb-16">
                    <motion.h1 
                        variants={itemVariants}
                        className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.8]"
                    >
                        Get In <span className="text-brand-orange">Touch</span>
                    </motion.h1>
                    <motion.p 
                        variants={itemVariants}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed"
                    >
                        Have a project in mind, a song request, or just want to say hi? I'm always open to new opportunities and interesting conversations.
                    </motion.p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    <motion.div variants={itemVariants} className="lg:col-span-7 bg-tertiary/20 border border-light/50 p-6 md:p-10 rounded-3xl backdrop-blur-sm">
                        <ModularContactForm initialType="GENERAL" />
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8">
                        {/* Direct Email Card */}
                        <div className="group p-8 bg-tertiary/30 border border-light/50 rounded-2xl hover:border-brand-orange/30 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-black uppercase tracking-[0.2em] text-xs">Direct Support</h3>
                            </div>
                            <div className="space-y-4">
                                <a 
                                    href="mailto:suvojeet@suvojeetsengupta.in" 
                                    className="flex items-center justify-between group/link"
                                >
                                    <span className="text-sm font-bold text-muted-foreground group-hover/link:text-brand-orange transition-colors">suvojeet@suvojeetsengupta.in</span>
                                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                                <div className="h-px bg-light/50" />
                                <a 
                                    href="mailto:support@suvojeetsengupta.in" 
                                    className="flex items-center justify-between group/link"
                                >
                                    <span className="text-sm font-bold text-muted-foreground group-hover/link:text-brand-orange transition-colors">support@suvojeetsengupta.in</span>
                                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Response Time Card */}
                        <div className="p-8 bg-tertiary/30 border border-light/50 rounded-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-black uppercase tracking-[0.2em] text-xs">Response Time</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                I typically respond to all inquiries within <span className="text-foreground font-bold">24-48 hours</span>. Please provide as much detail as possible.
                            </p>
                        </div>
                        
                        {/* Process Card */}
                        <div className="p-8 border border-light/50 rounded-2xl bg-background/50 backdrop-blur-sm">
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs mb-8">What to expect</h3>
                            <div className="space-y-6">
                                {[
                                    { step: '01', title: 'Selection', desc: 'Choose the relevant category for your inquiry.' },
                                    { step: '02', title: 'Detailing', desc: 'Provide necessary information and your message.' },
                                    { step: '03', title: 'Review', desc: 'I personally review every message and respond via email.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <span className="text-[10px] font-black text-brand-orange pt-1">{item.step}</span>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold uppercase tracking-widest">{item.title}</h4>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
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

