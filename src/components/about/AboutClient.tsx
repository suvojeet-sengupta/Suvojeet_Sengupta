import React from 'react';
import { skillGroups, nowFocus, timeline } from '@/data/aboutData';
import ModularContactForm from '../contact/ModularContactForm';
import SocialLinks from '../contact/SocialLinks';
import ResumeHub from './ResumeHub';

const AboutClient = () => {
    return (
        <div className="page">
            {/* ========= INTRO ========= */}
            <header className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 items-start">
                <div>
                    <p className="page-eyebrow">About</p>
                    <h1 className="page-title">
                        Developer and vocalist, based in Dhanbad.
                    </h1>
                    <div className="space-y-5 max-w-[38rem] text-[17px] sm:text-[18px] leading-[1.7] text-[color:var(--text-secondary)]">
                        <p className="text-[length:inherit] leading-[inherit]">
                            I&apos;m Suvojeet Sengupta. I was born in Burnpur, Asansol in 2005 and
                            now live in Dhanbad, Jharkhand. I work in two fields and take both
                            seriously: software, where I build Android apps and backend services,
                            and music, where I sing Hindi and Bengali songs.
                        </p>
                        <p className="text-[length:inherit] leading-[inherit]">
                            I learned Android from the inside, maintaining a custom ROM for the
                            Redmi 12 5G, and went on to build NoteNext and SuvMusic. Today I&apos;m
                            a software developer intern at gOGig, where I work on Android app
                            development, web and backend. Outside work, most of my attention is on
                            backend: API design, authentication, databases and deployment.
                            I use AI tools to write code faster, and I review, test and take
                            responsibility for everything that ships. This site runs on a NestJS
                            API I built and host myself.
                        </p>
                        <p className="text-[length:inherit] leading-[inherit]">
                            Music came first. I grew up with Kishore Kumar and Lata Mangeshkar at
                            home, started practising properly around 2015, and today record covers
                            and perform live.
                        </p>
                    </div>

                    <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 border-t border-[color:var(--line-strong)] max-w-[38rem]">
                        {[
                            ['Currently', 'Software Developer Intern, gOGig'],
                            ['Focus', 'Android, web and backend'],
                            ['Sings in', 'Hindi and Bengali'],
                            ['Based in', 'Dhanbad, India'],
                        ].map(([label, value]) => (
                            <div key={label} className="py-4 pr-4 border-b border-[color:var(--line)]">
                                <dt className="text-[13px] text-[color:var(--text-muted)] mb-1">{label}</dt>
                                <dd className="text-[15px] text-[color:var(--text-primary)]">{value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-8">
                        <SocialLinks />
                    </div>
                </div>

                <figure className="order-first lg:order-none">
                    <picture>
                        <source
                            type="image/webp"
                            srcSet="/portrait-720.webp 720w, /portrait-1200.webp 1200w"
                            sizes="(max-width: 1023px) 100vw, 40vw"
                        />
                        <img
                            src="/portrait.jpg"
                            alt="Portrait of Suvojeet Sengupta"
                            width={1200}
                            height={1600}
                            className="w-full h-auto aspect-[4/5] object-cover object-top rounded-[4px] max-h-[70vh] lg:max-h-none"
                        />
                    </picture>
                </figure>
            </header>

            {/* ========= EXPERIENCE ========= */}
            <ResumeHub />

            {/* ========= SKILLS ========= */}
            <section className="sec">
                <header className="sec-head">
                    <span className="sec-num">02</span>
                    <h2 className="sec-title">Skills</h2>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10">
                    {skillGroups.map((group) => (
                        <div key={group.title} className="py-8">
                            <h3 className="text-[22px] italic mb-4">{group.title}</h3>
                            <ul className="space-y-2 text-[15px] text-[color:var(--text-secondary)]">
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========= TIMELINE ========= */}
            <section className="sec">
                <header className="sec-head">
                    <span className="sec-num">03</span>
                    <h2 className="sec-title">Timeline</h2>
                </header>
                <ol>
                    {timeline.map((event) => (
                        <li
                            key={`${event.year}-${event.title}`}
                            className="grid grid-cols-[48px_1fr] md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.3fr)] gap-x-0 md:gap-x-8 gap-y-2 py-6 border-b border-[color:var(--line)]"
                        >
                            <span className="font-mono text-[13px] text-[color:var(--text-muted)] pt-1">{event.year}</span>
                            <h3 className="text-[21px] leading-snug">{event.title}</h3>
                            <p className="col-start-2 md:col-start-3 text-[15px] max-w-xl">{event.description}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ========= NOW ========= */}
            <section className="sec">
                <header className="sec-head">
                    <span className="sec-num">04</span>
                    <h2 className="sec-title">What I&apos;m working toward</h2>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    {nowFocus.map((item) => (
                        <div key={item.title} className="py-8">
                            <h3 className="text-[24px] italic mb-3">{item.title}</h3>
                            <p className="text-[16px] max-w-md">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========= CONTACT ========= */}
            <section className="sec">
                <header className="sec-head">
                    <span className="sec-num">05</span>
                    <h2 className="sec-title">Get in touch</h2>
                </header>
                <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 pt-8">
                    <div>
                        <p className="text-[17px] max-w-sm">
                            For roles, freelance work, collaborations or a song request, send a
                            message here or email me directly.
                        </p>
                        <a
                            href="mailto:suvojeet@suvojeetsengupta.in"
                            className="text-link mt-6 text-[16px]"
                        >
                            suvojeet@suvojeetsengupta.in
                        </a>
                    </div>
                    <ModularContactForm initialType="GENERAL" />
                </div>
            </section>
        </div>
    );
};

export default AboutClient;
