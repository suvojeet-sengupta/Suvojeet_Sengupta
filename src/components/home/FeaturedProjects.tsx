import React from 'react';
import Link from 'next/link';
import { fetchGithubRepo, GithubRepo } from '@/lib/github';
import styles from './FeaturedProjects.module.css';

const FEATURED_PROJECT_NAMES = ['SuvMusic', 'NoteNext'];

const FALLBACK_DATA: Record<string, Partial<GithubRepo>> = {
  SuvMusic: {
    name: 'SuvMusic',
    description:
      'A high-performance YouTube Music client built with Kotlin, featuring seamless streaming and advanced media handling.',
    stargazers_count: 10,
    language: 'Kotlin',
    html_url: 'https://github.com/suvojeet-sengupta/SuvMusic',
  },
  NoteNext: {
    name: 'NoteNext',
    description:
      'A professional note-taking application for Android with cloud sync and markdown support.',
    stargazers_count: 5,
    language: 'Kotlin',
    html_url: 'https://github.com/suvojeet-sengupta/NoteNext',
  },
};

const VOCAL_TRACKS = [
  {
    lang: 'Vocal',
    title: 'Tum Hi Ho',
    em: '(Cover)',
    desc:
      'Arijit Singh classic, reimagined with stripped acoustic phrasing and a longer outro. Recorded one mic, one take.',
    stars: '★ Live',
    duration: '04:21',
    href: '/music',
  },
  {
    lang: 'Bengali',
    title: 'Coffee Houser Sei Adda',
    em: '(Folk)',
    desc:
      'A tribute to Manna Dey. Bengali soul, dragged into the present with warm room reverb and a slower BPM.',
    stars: '★ Live',
    duration: '05:12',
    href: '/music',
  },
];

const SITE_TRACK = {
  lang: 'Next.js',
  title: 'This Portfolio',
  em: '(B-Side)',
  desc:
    'React 19, Tailwind v4, Cloudflare D1. Shipped, opinionated, fast — built in the same booth where the vocals get cut.',
  stars: '★ Open',
  duration: new Date().getFullYear().toString(),
  href: 'https://github.com/suvojeet-sengupta',
};

export default async function FeaturedProjects() {
  const repoPromises = FEATURED_PROJECT_NAMES.map((name) =>
    fetchGithubRepo('suvojeet-sengupta', name)
  );
  const results = await Promise.all(repoPromises);

  const repos: Record<string, Partial<GithubRepo>> = {};
  results.forEach((repoData, index) => {
    const name = FEATURED_PROJECT_NAMES[index];
    repos[name] = repoData ?? FALLBACK_DATA[name];
  });

  // Build the unified tracklist: code projects (live data) + vocal tracks + portfolio.
  const tracks = [
    ...FEATURED_PROJECT_NAMES.map((name) => {
      const repo = repos[name];
      return {
        lang: repo?.language || 'Kotlin',
        title: name,
        em: name === 'SuvMusic' ? '(Studio LP)' : '(EP)',
        desc:
          repo?.description ||
          'Signature Android application built with performance and user experience in mind.',
        stars: `★ ${repo?.stargazers_count ?? 0}`,
        duration: `v${repo?.stargazers_count ? '2.4.1' : '1.0'}`,
        href: `/${name.toLowerCase()}`,
        external: false,
        githubUrl: repo?.html_url,
      };
    }),
    ...VOCAL_TRACKS.map((t) => ({ ...t, external: false, githubUrl: undefined })),
    { ...SITE_TRACK, external: true, githubUrl: undefined },
  ];

  return (
    <div className={styles.tracks}>
      {tracks.map((track, i) => {
        const num = String(i + 1).padStart(2, '0');
        return (
          <Link
            key={`${track.title}-${i}`}
            href={track.href}
            target={track.external ? '_blank' : undefined}
            rel={track.external ? 'noopener noreferrer' : undefined}
            className={styles.track}
          >
            <div className={styles.trackNum}>{num}</div>
            <div className={styles.trackTitleWrap}>
              <div className={styles.trackLang}>{track.lang}</div>
              <div className={styles.trackTitle}>
                {track.title}
                <em>{track.em}</em>
              </div>
            </div>
            <div className={styles.trackDesc}>{track.desc}</div>
            <div className={styles.trackStars}>{track.stars}</div>
            <div className={styles.trackDuration}>{track.duration}</div>
          </Link>
        );
      })}
    </div>
  );
}

export function FeaturedProjectsSkeleton() {
  return (
    <div className={styles.tracks}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`${styles.track} ${styles.skeletonTrack}`}>
          <div className={styles.trackNum}>0{i}</div>
          <div className={styles.skeletonBlock} style={{ width: '60%', height: 24 }} />
          <div className={styles.skeletonBlock} style={{ width: '90%', height: 14 }} />
          <div className={styles.skeletonBlock} style={{ width: 40, height: 14 }} />
          <div className={styles.skeletonBlock} style={{ width: 50, height: 14 }} />
        </div>
      ))}
    </div>
  );
}
