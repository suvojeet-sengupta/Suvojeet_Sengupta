'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { experiences, summary } from '@/data/resumeData';

const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ExpandIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ResumeHub = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDownload = () => {
        setDownloading(true);

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 18;
        const contentWidth = pageWidth - margin * 2;
        let y = 18;

        // Helper functions
        const addLine = (text: string, size: number, style: 'bold' | 'normal' = 'normal', align: 'left' | 'center' = 'left', x = margin) => {
            doc.setFontSize(size);
            doc.setFont('helvetica', style);
            const xPos = align === 'center' ? pageWidth / 2 : x;
            doc.text(text, xPos, y, { align });
            y += size * 0.55;
        };

        const addWrappedText = (text: string, size: number, style: 'bold' | 'normal' = 'normal', color?: [number, number, number]) => {
            doc.setFontSize(size);
            doc.setFont('helvetica', style);
            if (color) doc.setTextColor(...color);
            const lines = doc.splitTextToSize(text, contentWidth);
            lines.forEach((line: string) => {
                if (y > 275) { doc.addPage(); y = 18; }
                doc.text(line, margin, y);
                y += size * 0.5;
            });
            if (color) doc.setTextColor(0, 0, 0);
        };

        const addBulletPoint = (text: string, size: number = 9) => {
            doc.setFontSize(size);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 140, 0);
            doc.text('•', margin + 2, y);
            doc.setTextColor(50, 50, 50);
            const lines = doc.splitTextToSize(text, contentWidth - 10);
            lines.forEach((line: string) => {
                if (y > 275) { doc.addPage(); y = 18; }
                doc.text(line, margin + 8, y);
                y += size * 0.5;
            });
        };

        const addSectionDivider = (width: number = 1) => {
            if (y > 270) { doc.addPage(); y = 18; }
            doc.setDrawColor(255, 140, 0);
            doc.setLineWidth(width);
            doc.line(margin, y, pageWidth - margin, y);
            y += 8;
        };

        // ===== HEADER =====
        addSectionDivider(2.5);
        addLine('SUVOJEET SENGUPTA', 24, 'bold', 'center');
        addLine('Singer | Creative Developer | AI Enthusiast', 11, 'normal', 'center');
        addLine('Born in Asansol, West Bengal  |  Based in Dhanbad, Jharkhand', 10, 'normal', 'center');
        addLine('Born: 1st August 2005', 10, 'normal', 'center');
        addLine('suvojeetsengupta.in  |  github.com/suvojeet-sengupta', 9, 'normal', 'center');
        y += 2;
        addSectionDivider(1.5);

        // ===== SUMMARY =====
        addLine('SUMMARY', 13, 'bold');
        y += 2;
        addWrappedText(summary, 9.5, 'normal', [60, 60, 60]);
        y += 4;

        // ===== EXPERIENCE =====
        addSectionDivider(1.5);
        addLine('PROFESSIONAL EXPERIENCE', 13, 'bold');
        y += 4;

        experiences.forEach((exp, index) => {
            if (y > 220) { doc.addPage(); y = 18; }

            // Experience Header
            doc.setFillColor(255, 248, 240);
            doc.roundedRect(margin, y - 3, contentWidth, 15, 2, 2, 'F');
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 140, 0);
            doc.text(`${exp.icon}  ${exp.role}`, margin + 3, y + 3);
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text(`${exp.company}  |  ${exp.period}`, margin + 3, y + 9);
            doc.setTextColor(0, 0, 0);
            y += 18;

            // Description
            addWrappedText(exp.description, 9, 'normal', [70, 70, 70]);
            y += 2;

            // Key Contributions
            addLine('Key Contributions', 10, 'bold');
            y += 1;
            exp.details.forEach(detail => {
                addBulletPoint(detail, 9);
                y += 1;
            });

            // Skills Tags
            y += 1;
            addLine('Skills', 9, 'bold');
            y += 1;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            let skillX = margin + 2;
            const skillLineHeight = 5;
            exp.skills.forEach((skill, i) => {
                const skillWidth = doc.getTextWidth(skill) + 6;
                if (skillX + skillWidth > pageWidth - margin) {
                    skillX = margin + 2;
                    y += skillLineHeight + 1;
                }
                if (y > 275) { doc.addPage(); y = 18; skillX = margin + 2; }
                doc.setFillColor(255, 248, 240);
                doc.setDrawColor(255, 160, 50);
                doc.roundedRect(skillX, y - 3, skillWidth, skillLineHeight, 1, 1, 'FD');
                doc.setTextColor(80, 60, 20);
                doc.text(skill, skillX + 3, y);
                doc.setTextColor(0, 0, 0);
                skillX += skillWidth + 3;
            });
            y += skillLineHeight + 4;

            // Link
            if (exp.link) {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(255, 140, 0);
                doc.text(`${exp.linkLabel || exp.link}: ${exp.link}`, margin, y);
                doc.setTextColor(0, 0, 0);
                y += 5;
            }

            // Divider between experiences
            if (index < experiences.length - 1) {
                y += 2;
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.3);
                doc.setLineDashPattern([2, 2], 0);
                doc.line(margin, y, pageWidth - margin, y);
                doc.setLineDashPattern([], 0);
                y += 5;
            }
        });

        // Core Skills Section
        if (y > 240) { doc.addPage(); y = 18; }
        addSectionDivider(1.5);
        addLine('CORE SKILLS', 13, 'bold');
        y += 3;
        const coreSkills = ['Hindi & Bengali Singing', 'AI Technologies', 'Custom ROM Maintenance', 'Android (Kotlin/Java)', 'Web Development', 'Full-Stack Development', 'Customer Communication', 'Open Source Collaboration'];
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        let x = margin;
        coreSkills.forEach((skill) => {
            const w = doc.getTextWidth(skill) + 8;
            if (x + w > pageWidth - margin) { x = margin; y += 8; }
            if (y > 275) { doc.addPage(); y = 18; x = margin; }
            doc.setFillColor(255, 248, 240);
            doc.setDrawColor(255, 160, 50);
            doc.roundedRect(x, y - 3, w, 6, 1.5, 1.5, 'FD');
            doc.setTextColor(80, 60, 20);
            doc.text(skill, x + 4, y + 1);
            doc.setTextColor(0, 0, 0);
            x += w + 3;
        });
        y += 12;

        // Contact Section
        if (y > 250) { doc.addPage(); y = 18; }
        addSectionDivider(1.5);
        addLine('CONTACT', 13, 'bold');
        y += 3;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text('GitHub: github.com/suvojeet-sengupta', margin, y);
        y += 6;
        doc.text('Website: suvojeetsengupta.in', margin, y);
        doc.setTextColor(0, 0, 0);

        // Footer
        y += 12;
        doc.setDrawColor(255, 140, 0);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('Last Updated: April 2026', pageWidth / 2, y, { align: 'center' });

        doc.save('Suvojeet_Sengupta_Resume.pdf');
        setDownloading(false);
    };

    return (
        <section className="py-24 bg-tertiary">
            <div className="section-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Professional <span className="text-brand-orange">Journey</span>
                    </motion.h2>
                    <motion.p
                        className="text-secondary font-medium text-lg leading-relaxed max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        From customer support at DishTV to full-stack development at Gogig — a journey of constant evolution.
                    </motion.p>
                </div>

                {/* Experience Timeline */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {experiences.map((exp, index) => {
                        const isExpanded = expandedId === exp.id;
                        return (
                            <motion.div
                                key={exp.id}
                                className="professional-card border overflow-hidden"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Header - Always Visible */}
                                <button
                                    onClick={() => toggleExpand(exp.id)}
                                    className="w-full p-6 flex items-center justify-between text-left hover:bg-tertiary/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <span className="text-3xl">{exp.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold">{exp.role}</h3>
                                            <p className="text-sm text-brand-orange font-medium">{exp.company} | {exp.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                        {exp.link && (
                                            <a
                                                href={exp.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-muted hover:text-brand-orange transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {exp.linkLabel || 'Visit'}
                                            </a>
                                        )}
                                        <ExpandIcon expanded={isExpanded} />
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-2 border-t border-light/50">
                                                {/* Description */}
                                                <p className="text-secondary mb-6 leading-relaxed">
                                                    {exp.description}
                                                </p>

                                                {/* Key Contributions */}
                                                <div className="mb-6">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-3">
                                                        Key Contributions
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {exp.details.map((detail, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm text-secondary">
                                                                <span className="w-1.5 h-1.5 bg-brand-orange mt-2 flex-shrink-0" />
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Skills */}
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-3">
                                                        Skills
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {exp.skills.map((skill, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 bg-background border border-light/50 text-xs font-bold rounded-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Download Button */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.button
                        className="btn-solid inline-flex items-center gap-3 px-12 py-4 text-sm font-black uppercase tracking-widest disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        <DownloadIcon />
                        <span>{downloading ? 'Generating...' : 'Download Resume PDF'}</span>
                    </motion.button>
                    <p className="text-[10px] text-center text-muted font-black uppercase tracking-widest mt-4">
                        Last Updated: April 2026
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ResumeHub;
