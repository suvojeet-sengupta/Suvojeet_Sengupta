import React from 'react';
import Link from 'next/link';
import { fetchGithubStats } from '@/lib/github';
import styles from './HomePage.module.css';

const GITHUB_URL = 'https://github.com/suvojeet-sengupta';
const YOUTUBE_URL = 'https://youtube.com/@suvojeetsengupta';
const EMAIL = 'suvojeet@suvojeetsengupta.in';

// Shown if the GitHub stats API is unreachable
const FALLBACK_STARS = 300;
const FALLBACK_REPOS = 100;

interface HomePageProps {
  children?: React.ReactNode;
}

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

export default async function HomePage({ children }: HomePageProps) {
  const github = await fetchGithubStats();
  const stars = github?.totalStars ?? FALLBACK_STARS;
  const repos = github?.totalRepos ?? FALLBACK_REPOS;

  return (
    <div className={styles.page}>
      {/* ========= HERO ========= */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow} style={{ animationDelay: '80ms' }}>
              Software developer &amp; vocalist · Dhanbad, India
            </p>
            <h1 className={styles.heroTitle} style={{ animationDelay: '160ms' }}>
              Suvojeet Sengupta
            </h1>
            <p className={styles.heroLede} style={{ animationDelay: '260ms' }}>
              I build Android apps, websites and the backend systems behind them,
              currently as a software developer intern at gOGig. I also sing Hindi and
              Bengali music. Two crafts, practised with the same care.
            </p>

            <div className={styles.heroActions} style={{ animationDelay: '360ms' }}>
              <Link href="#work" className="btn-solid">
                See my work
              </Link>
              <Link href="/music" className="btn-outline">
                Listen to my music
              </Link>
            </div>

            <dl className={styles.heroFacts} style={{ animationDelay: '460ms' }}>
              <div>
                <dt>Currently</dt>
                <dd>Developer intern, gOGig</dd>
              </div>
              <div>
                <dt>Music</dt>
                <dd>Hindi &amp; Bengali vocals</dd>
              </div>
              <div>
                <dt>Open source</dt>
                <dd>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    {stars} stars on GitHub
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <figure className={styles.portrait}>
            <picture>
              <source
                type="image/webp"
                srcSet="/portrait-720.webp 720w, /portrait-1200.webp 1200w"
                sizes="(max-width: 1023px) 100vw, 42vw"
              />
              <img
                src="/portrait.jpg"
                alt="Portrait of Suvojeet Sengupta in a black suit"
                width={1200}
                height={1600}
                fetchPriority="high"
              />
            </picture>
          </figure>
        </div>
      </section>

      {/* ========= WORK ========= */}
      <section id="work" className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.sectionNum}>01</span>
          <h2 className={styles.sectionTitle}>Selected work</h2>
          <p className={styles.sectionNote}>Star counts are pulled live from GitHub.</p>
        </header>
        {children}
      </section>

      {/* ========= PRACTICE ========= */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionTitle}>Two disciplines</h2>
          <p className={styles.sectionNote}>Neither is a side project.</p>
        </header>

        <div className={styles.practice}>
          <article className={styles.practiceCol}>
            <h3>Engineering</h3>
            <p>
              I started with Android and kept going down the stack. At gOGig I work
              across Android app development, web and backend. My own apps are native
              Kotlin with Jetpack Compose, and on the backend I design REST APIs,
              authentication and caching, and get services deployed and running reliably.
              I use AI tools to write code faster, and review and test everything I ship.
            </p>
            <p>
              I&apos;m still learning, and I learn by shipping. This site runs on an
              API I built and maintain myself.
            </p>
            <ul className={styles.tagList} aria-label="Tools">
              <li>Kotlin</li>
              <li>Jetpack Compose</li>
              <li>TypeScript</li>
              <li>NestJS</li>
              <li>Node.js</li>
              <li>Next.js</li>
              <li>Cloudflare D1 &amp; KV</li>
              <li>Docker</li>
            </ul>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              GitHub profile <ArrowUpRight />
            </a>
          </article>

          <article className={styles.practiceCol}>
            <h3>Music</h3>
            <p>
              I sing Hindi and Bengali songs, from the film classics of Kishore
              Kumar and Lata Mangeshkar to Arijit Singh&apos;s modern catalogue. I
              record covers and perform live.
            </p>
            <p>
              Singing taught me what engineering later confirmed: phrasing, timing and
              repetition matter more than talent on its own.
            </p>
            <ul className={styles.tagList} aria-label="Repertoire">
              <li>Hindi film songs</li>
              <li>Bengali songs</li>
              <li>Modern Bollywood</li>
              <li>Patriotic songs</li>
              <li>Covers</li>
              <li>Live performance</li>
            </ul>
            <div className={styles.linkRow}>
              <Link href="/music" className={styles.textLink}>
                Listen <ArrowRight />
              </Link>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                YouTube <ArrowUpRight />
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ========= NUMBERS ========= */}
      <section className={styles.numbersWrap} aria-label="At a glance">
        <dl className={styles.numbers}>
          <div>
            <dt>GitHub stars across my projects</dt>
            <dd>{stars}</dd>
          </div>
          <div>
            <dt>Public repositories</dt>
            <dd>{repos}</dd>
          </div>
          <div>
            <dt>Songs recorded</dt>
            <dd>20+</dd>
          </div>
          <div>
            <dt>Languages I sing in</dt>
            <dd>2</dd>
          </div>
        </dl>
      </section>

      {/* ========= CONTACT ========= */}
      <section className={styles.contact}>
        <div className={styles.contactInner}>
          <h2 className={styles.contactTitle}>
            Have a project, a role, or a song in mind?
          </h2>
          <div className={styles.contactActions}>
            <a href={`mailto:${EMAIL}`} className={styles.contactEmail}>
              {EMAIL}
            </a>
            <Link href="/contact" className="btn-outline">
              Use the contact form <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
