import React from 'react';
import Link from 'next/link';
import { fetchGithubRepo, GithubRepo } from '@/lib/github';
import uiStyles from '@/components/common/UI.module.css';

const FEATURED_PROJECT_NAMES = ['SuvMusic', 'NoteNext'];

const FALLBACK_DATA: Record<string, Partial<GithubRepo>> = {
  'SuvMusic': {
    name: 'SuvMusic',
    description: 'A high-performance YouTube Music client built with Kotlin, featuring seamless streaming and advanced media handling.',
    stargazers_count: 10,
    language: 'Kotlin',
    html_url: 'https://github.com/suvojeet-sengupta/SuvMusic'
  },
  'NoteNext': {
    name: 'NoteNext',
    description: 'A professional note-taking application for Android with cloud sync and markdown support.',
    stargazers_count: 5,
    language: 'Kotlin',
    html_url: 'https://github.com/suvojeet-sengupta/NoteNext'
  }
};

export default async function FeaturedProjects() {
  const repoPromises = FEATURED_PROJECT_NAMES.map(name => 
    fetchGithubRepo('suvojeet-sengupta', name)
  );
  
  const results = await Promise.all(repoPromises);
  
  const repos: Record<string, any> = {};
  results.forEach((repoData, index) => {
    const name = FEATURED_PROJECT_NAMES[index];
    if (repoData) {
      repos[name] = repoData;
    } else {
      // Use fallback if API fails
      repos[name] = FALLBACK_DATA[name];
    }
  });

  return (
    <div className={uiStyles.projectGrid}>
      {FEATURED_PROJECT_NAMES.map((name) => {
        const repo = repos[name];
        
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
              {repo.description || (name === 'SuvMusic' 
                ? 'A high-performance YouTube Music client built with Kotlin, featuring seamless streaming and advanced media handling.'
                : 'Signature Android application built with performance and user experience in mind.')}
            </p>
            <Link 
              href={name.toLowerCase()} 
              className="inline-flex items-center gap-2 font-bold text-sm bg-brand-orange text-white px-4 py-2 rounded-sm hover:bg-orange-600 transition-colors mb-4"
            >
              VIEW DETAILS
            </Link>
            <br />
            <Link 
              href={repo.html_url} 
              target="_blank"
              className="inline-flex items-center gap-2 font-bold text-xs border-b border-muted text-muted hover:text-brand-orange hover:border-brand-orange transition-colors"
            >
              GITHUB SOURCE →
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export function FeaturedProjectsSkeleton() {
    return (
      <div className={uiStyles.projectGrid}>
        {[1, 2].map((i) => (
          <div key={i} className={uiStyles.professionalCard + " animate-pulse"}>
            <div className="h-4 bg-background/50 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-background/50 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-background/50 rounded w-full mb-6"></div>
            <div className="h-4 bg-background/50 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
}
