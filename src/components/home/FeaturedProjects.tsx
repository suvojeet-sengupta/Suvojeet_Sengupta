import React from 'react';
import Link from 'next/link';
import { fetchGithubRepo } from '@/lib/github';
import styles from './FeaturedProjects.module.css';

interface Project {
  name: string;
  kind: string;
  description: string;
  stack: string;
  href: string;
  external?: boolean;
  repo?: { owner: string; name: string };
  fallbackStars?: number;
}

const PROJECTS: Project[] = [
  {
    name: 'SuvMusic',
    kind: 'Android app',
    description:
      'A YouTube Music client for Android focused on smooth playback and a clean, native interface.',
    stack: 'Kotlin · Jetpack Compose · Media3',
    href: '/suvmusic',
    repo: { owner: 'suvojeet-sengupta', name: 'SuvMusic' },
    fallbackStars: 290,
  },
  {
    name: 'NoteNext',
    kind: 'Android app',
    description:
      'An offline-first notes app with biometric lock and rich-text editing. Your notes never leave the device.',
    stack: 'Kotlin · Jetpack Compose',
    href: '/notenext',
    repo: { owner: 'NoteNext', name: 'NoteNext' },
    fallbackStars: 15,
  },
  {
    name: 'suvojeetsengupta.in',
    kind: 'Website & backend API',
    description:
      'This site, plus the NestJS API behind it: Docker on a VPS behind Cloudflare Tunnel, D1 and KV storage, JWT admin auth, web push, and OG image generation.',
    stack: 'TypeScript · Next.js · NestJS · Docker',
    href: 'https://github.com/suvojeet-sengupta/Suvojeet_Sengupta',
    external: true,
  },
];

export default async function FeaturedProjects() {
  const repoData = await Promise.all(
    PROJECTS.map((p) => (p.repo ? fetchGithubRepo(p.repo.owner, p.repo.name) : Promise.resolve(null)))
  );

  return (
    <ol className={styles.list}>
      {PROJECTS.map((project, i) => {
        const stars = repoData[i]?.stargazers_count ?? project.fallbackStars;
        return (
          <li key={project.name}>
            <Link
              href={project.href}
              target={project.external ? '_blank' : undefined}
              rel={project.external ? 'noopener noreferrer' : undefined}
              className={styles.row}
            >
              <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.heading}>
                <h3 className={styles.name}>{project.name}</h3>
                <span className={styles.kind}>{project.kind}</span>
              </div>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.meta}>
                <span>{project.stack}</span>
                {typeof stars === 'number' && <span>★ {stars}</span>}
              </div>
              <span className={styles.arrow} aria-hidden="true">
                {project.external ? '↗' : '→'}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function FeaturedProjectsSkeleton() {
  return (
    <ol className={styles.list} aria-busy="true">
      {[1, 2, 3].map((i) => (
        <li key={i}>
          <div className={styles.row}>
            <span className={styles.index}>0{i}</span>
            <div className={styles.skeleton} style={{ width: '55%', height: 30 }} />
            <div className={styles.skeleton} style={{ width: '90%', height: 16 }} />
            <div className={styles.skeleton} style={{ width: '60%', height: 14 }} />
          </div>
        </li>
      ))}
    </ol>
  );
}
