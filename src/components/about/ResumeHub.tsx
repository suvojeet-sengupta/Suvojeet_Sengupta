'use client';

import React, { useState } from 'react';
import { experiences, summary } from '@/data/resumeData';

const INK: [number, number, number] = [22, 23, 26];
const GREY: [number, number, number] = [96, 97, 102];
const RULE: [number, number, number] = [210, 208, 204];

async function downloadResumePdf() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 24;

    const ensureSpace = (needed: number) => {
        if (y + needed > 280) {
            doc.addPage();
            y = 22;
        }
    };

    const text = (value: string, size: number, style: 'normal' | 'bold' = 'normal', color = INK, x = margin) => {
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(value, contentWidth - (x - margin));
        lines.forEach((line: string) => {
            ensureSpace(size * 0.5);
            doc.text(line, x, y);
            y += size * 0.47;
        });
    };

    const rule = () => {
        ensureSpace(8);
        doc.setDrawColor(...RULE);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 7;
    };

    const heading = (label: string) => {
        y += 3;
        rule();
        text(label.toUpperCase(), 9, 'bold', GREY);
        y += 3;
    };

    // Header
    text('Suvojeet Sengupta', 22, 'bold');
    y += 1;
    text('Software Developer & Vocalist', 11, 'normal', GREY);
    text('Dhanbad, India  ·  suvojeet@suvojeetsengupta.in  ·  suvojeetsengupta.in  ·  github.com/suvojeet-sengupta', 9, 'normal', GREY);

    heading('Summary');
    text(summary, 10);

    heading('Experience');
    experiences.forEach((exp, index) => {
        ensureSpace(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...INK);
        doc.text(exp.role, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GREY);
        doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
        y += 5;
        text(exp.company, 9.5, 'normal', GREY);
        y += 1;
        text(exp.description, 9.5);
        y += 1;
        exp.details.forEach((detail) => {
            ensureSpace(6);
            doc.setFontSize(9.5);
            doc.setTextColor(...GREY);
            doc.text('–', margin + 1, y);
            text(detail, 9.5, 'normal', INK, margin + 6);
        });
        y += 1;
        text(exp.skills.join('  ·  '), 8.5, 'normal', GREY);
        if (index < experiences.length - 1) y += 5;
    });

    doc.save('Suvojeet_Sengupta_Resume.pdf');
}

const ResumeHub = () => {
    const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id ?? null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadResumePdf();
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Could not generate the PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <section className="sec">
            <header className="sec-head">
                <span className="sec-num">01</span>
                <h2 className="sec-title">Experience</h2>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="sec-note text-link !text-[14px] justify-self-start md:justify-self-end disabled:opacity-50"
                >
                    {downloading ? 'Preparing PDF…' : 'Download résumé (PDF)'}
                </button>
            </header>

            <ol>
                {experiences.map((exp) => {
                    const isExpanded = expandedId === exp.id;
                    const panelId = `exp-${exp.id}`;
                    return (
                        <li key={exp.id} className="border-b border-[color:var(--line)]">
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                                aria-expanded={isExpanded}
                                aria-controls={panelId}
                                className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.3fr)_auto] gap-x-8 gap-y-1 py-6 text-left items-baseline group"
                            >
                                <span className="hidden md:block font-mono text-[13px] text-[color:var(--text-muted)]">
                                    {exp.period.slice(0, 4).match(/\d{4}/) ? exp.period.slice(0, 4) : '—'}
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-serif text-[22px] leading-snug group-hover:underline underline-offset-4 decoration-1">
                                        {exp.role}
                                    </span>
                                    <span className="block text-[14px] text-[color:var(--text-tertiary)] mt-1 md:hidden">
                                        {exp.company} · {exp.period}
                                    </span>
                                </span>
                                <span className="hidden md:block text-[15px] text-[color:var(--text-secondary)]">
                                    {exp.company}
                                    <span className="text-[color:var(--text-muted)]"> · {exp.period}</span>
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`text-[20px] leading-none text-[color:var(--text-muted)] transition-transform ${isExpanded ? 'rotate-45' : ''}`}
                                >
                                    +
                                </span>
                            </button>

                            {isExpanded && (
                                <div id={panelId} className="pb-8 md:pl-[96px] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-x-8">
                                    <p className="text-[16px] mb-4 md:mb-0 max-w-md">{exp.description}</p>
                                    <div>
                                        <ul className="space-y-2 text-[15px] text-[color:var(--text-secondary)]">
                                            {exp.details.map((detail) => (
                                                <li key={detail} className="grid grid-cols-[16px_1fr]">
                                                    <span className="text-[color:var(--text-muted)]">–</span>
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {exp.skills.map((skill) => (
                                                <span key={skill} className="tag">{skill}</span>
                                            ))}
                                        </div>
                                        {exp.link && (
                                            <a
                                                href={exp.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-link mt-5 text-[14px]"
                                            >
                                                {exp.linkLabel || exp.link} ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

export default ResumeHub;
