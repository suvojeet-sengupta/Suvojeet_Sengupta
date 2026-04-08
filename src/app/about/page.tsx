'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { calculateAge } from '@/lib/utils';
import { timeline, skills, philosophy, futureGoals } from '@/data/aboutData';

const AboutPage = () => {
  const age = calculateAge('2005-08-01');

  return (
    <div className="pt-32 pb-20">
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-8">
            The <span className="text-accent">Story</span>
          </h1>
          <p className="text-xl text-secondary leading-relaxed mb-6">
            I'm a {age}-year-old developer from Asansol, West Bengal, who found a unique rhythm between the logic of code and the soul of music. 
          </p>
          <p className="text-lg text-secondary leading-relaxed">
            My journey isn't just about building apps; it's about creating tools that solve real problems, like SuvMusic for high-performance streaming and NoteNext for intuitive productivity. I believe in organic growth, creative problem solving, and constant learning.
          </p>
        </motion.div>
      </section>

      {/* Skills Grid */}
      <section className="bg-tertiary py-20 mt-20">
        <div className="section-container">
          <h2 className="text-4xl font-bold mb-12">Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.name} className="professional-card">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{skill.icon}</span>
                  <h3 className="text-xl font-bold">{skill.name}</h3>
                </div>
                <div className="w-full bg-border-light h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-brand-orange h-full"
                  />
                </div>
                <p className="mt-2 text-right text-xs font-bold text-muted">{skill.level}% Proficiency</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-container py-24">
        <h2 className="text-4xl font-bold mb-16 text-center">Milestones</h2>
        <div className="relative border-l-2 border-brand-orange ml-4 md:ml-0 md:left-1/2">
          {timeline.map((item, index) => (
            <motion.div 
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-12 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right md:left-[-50%]' : 'md:pl-12 md:left-[50%]'}`}
            >
              <div className="absolute top-0 w-4 h-4 bg-brand-orange rounded-full -left-[9px] md:left-auto md:right-[-9px] md:group-even:left-[-9px]"></div>
              <span className="text-brand-orange font-black text-2xl">{item.year}</span>
              <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
              <p className="text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-brand-black text-white py-24">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-8">My Philosophy</h2>
              <ul className="space-y-6">
                {philosophy.map((text, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="text-brand-orange font-bold text-xl">/</span>
                    <p className="text-gray-400 text-lg">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-8">Future Goals</h2>
              <div className="grid grid-cols-2 gap-4">
                {futureGoals.map((goal) => (
                  <div key={goal.label} className="p-6 border border-gray-800 rounded-sm hover:border-brand-orange transition-colors">
                    <span className="text-3xl mb-4 block">{goal.icon}</span>
                    <span className="font-bold text-sm uppercase tracking-widest">{goal.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
