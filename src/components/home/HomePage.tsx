'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calculateAge } from '@/lib/utils';
import { fetchGithubRepo, GithubRepo } from '@/lib/github';
import uiStyles from '@/components/common/UI.module.css';

const HomePage = () => {
  const age = calculateAge('2005-08-01');
  const [repos, setRepos] = useState<Record<string, GithubRepo>>({});
  const [loading, setLoading] = useState(true);

  const featuredProjectNames = ['SuvMusic', 'NoteNext'];

  useEffect(() => {
    const loadRepoData = async () => {
      const data: Record<string, GithubRepo> = {};
      for (const repoName of featuredProjectNames) {
        const repoData = await fetchGithubRepo('suvojeet-sengupta', repoName);
        if (repoData) {
          data[repoName] = repoData;
        }
      }
      setRepos(data);
      setLoading(false);
    };

    loadRepoData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="section-container pt-32 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Suvojeet <span className="text-accent">Sengupta</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-2xl font-medium">
              A {age}-year-old <span className="text-brand-orange font-bold">Singer</span> & Creative Developer. Soulful voice in Hindi & Bengali, building high-performance Android solutions.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/about" className={uiStyles.btnSolid + " text-lg px-8"}>
                About Me
              </Link>
              <Link href="/music" className={uiStyles.btnOutline + " text-lg px-8"}>
                Music Portfolio
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:w-1/3 flex justify-center"
          >
            <div className={uiStyles.profileFrame}>
              <Image 
                src="/suvojeet.jpg" 
                alt="Suvojeet Sengupta" 
                width={350} 
                height={350} 
                className="grayscale hover:grayscale-0 transition-all duration-500 object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-tertiary py-24">
        <div className="section-container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Core Projects</h2>
              <p className="text-secondary font-medium">Signature Android applications built with performance and user experience in mind.</p>
            </div>
            <Link href="https://github.com/suvojeet-sengupta" target="_blank" className="text-brand-orange font-bold hover:underline mb-2">
              View All Github →
            </Link>
          </div>

          <div className={uiStyles.projectGrid}>
            {featuredProjectNames.map((name) => {
              const repo = repos[name];
              if (loading) return (
                <div key={name} className={uiStyles.professionalCard + " animate-pulse"}>
                  <div className="h-4 bg-background/50 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-background/50 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-background/50 rounded w-full mb-6"></div>
                  <div className="h-4 bg-background/50 rounded w-1/2"></div>
                </div>
              );
              
              if (!repo) return null;

              return (
                <div key={name} className={uiStyles.professionalCard + " group"}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted">{repo.language || 'Kotlin'}</span>
                    <div className="flex items-center gap-1 text-brand-orange font-bold">
                      <span>★</span>
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 group-hover:text-accent transition-colors">{name}</h3>
                  <p className="text-secondary mb-6 line-clamp-3 font-medium">
                    {name === 'SuvMusic' 
                      ? 'A high-performance YouTube Music client built with Kotlin, featuring seamless streaming and advanced media handling.'
                      : repo.description}
                  </p>
                  <Link 
                    href={repo.html_url} 
                    target="_blank"
                    className="inline-flex items-center gap-2 font-bold text-sm border-b-2 border-brand-orange pb-1 hover:border-black transition-colors"
                  >
                    EXPLORE SOURCE CODE
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="section-container py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">My Approach</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-brand-black text-white flex items-center justify-center font-bold text-xl rounded-sm">01</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Technical Excellence</h4>
                  <p>I focus on clean architecture and performance. SuvMusic and NoteNext are built with native Android best practices, ensuring a smooth, real-world user experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-brand-orange text-white flex items-center justify-center font-bold text-xl rounded-sm">02</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Creative Thinking</h4>
                  <p>Good code is just one part. I bring creativity from my music background into my UI/UX design, making applications that feel "organic" and human-centric.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-brand-black text-white flex items-center justify-center font-bold text-xl rounded-sm">03</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Constant Evolution</h4>
                  <p>I believe in logic and creative problem solving over boilerplate knowledge. Every project is a step forward in mastering both arts.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-tertiary p-8 rounded-sm border-l-4 border-brand-orange">
            <h3 className="text-2xl font-bold mb-4 italic">"I build things that I want to use. If it's not fast, clean, and intuitive, it's not finished."</h3>
            <p className="text-right font-bold">— Suvojeet Sengupta</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-black text-white py-20">
        <div className="section-container text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Let's build something real together.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Whether you need a high-performance Android app, a modern web experience, or a musical collaboration, I'm ready to bring my creativity to your project.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/request-song" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-10 transition-colors rounded-sm uppercase tracking-widest">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
