# Suvojeet Sengupta | Singer and Creative Developer

Official portfolio of Suvojeet Sengupta, showcasing a unique integration of high-performance software engineering and professional vocal artistry.

## Professional Overview

Based in Asansol, West Bengal, Suvojeet Sengupta is a dual-identity professional specializing in Android development and Indian vocal music. This platform serves as a central hub for technical projects and musical performances, reflecting a commitment to precision in code and emotion in sound.

### Creative Developer Role
Focused on building high-performance Android and Web solutions. Core projects include:
- **SuvMusic**: A specialized music application designed for seamless user experiences.
- **NoteNext**: A productivity-focused application for efficient information management.

### Singer Role
A soulful vocalist performing in Hindi and Bengali.
- **Inspirations**: Deeply rooted in the classics of Kishore Kumar and Lata Mangeshkar, with modern influence from Arijit Singh.
- **Style**: Emphasizes organic practice and technical vocal precision.
- **Repertoire**: Covers a wide range of soulful melodies and contemporary hits.

## Technical Architecture

The website is built with a modern, high-performance stack designed for speed, SEO, and fluid user interaction.

### Core Technologies
- **Next.js 16**: Utilizing the App Router for optimized server-side rendering and routing.
- **React 19**: Leveraging the latest features for reactive and efficient UI components.
- **Tailwind CSS v4**: Implementing a utility-first design system with high performance.
- **TypeScript**: Ensuring type safety and maintainable code architecture.
- **Framer Motion**: Providing professional-grade animations and transitions.
- **Socket.io**: Enabling real-time communication features where applicable.

### Key Features
- **Dynamic SEO**: Optimized metadata for improved visibility on search engines.
- **Responsive Design**: Fully compatible across desktop, tablet, and mobile platforms.
- **Interactive Forms**: Integrated song request and contact systems utilizing formsubmit.co.
- **Theme Management**: Persistent light and dark mode support.

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/suvojeet-sengupta/Suvojeet_Sengupta.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Suvojeet_Sengupta
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/app/`: Core routing and page layouts.
- `src/components/`: Modular UI components categorized by feature (Home, Music, About).
- `src/data/`: Static and dynamic data configurations.
- `src/hooks/`: Custom React hooks for shared logic.
- `src/lib/`: Utility functions and third-party integrations.
- `public/`: Static assets including images and configuration files.

## Blog + Dashboard (Cloudflare D1)

### What is now added
- Public blog listing and blog details: `/blog`, `/blog/[slug]`
- User comments and replies on posts
- Admin login and dashboard: `/dashboard/login`, `/dashboard`
- Post management from dashboard:
  - create post
  - enable/disable comments
  - delete post
- Comment management from dashboard:
  - approve/unapprove
  - delete comment
  - owner reply (shown with verified tick)
- Stats in dashboard:
  - post count, comment count, reply count
  - blog views
  - tracked page visits

### D1 setup (your DB is already created)
Your `wrangler.toml` is configured with:
- database name: `suvojeet-db`
- database id: `59bccc80-bb22-46ff-9f54-6bf4be593af4`
- binding name: `DB`

If you deploy through Cloudflare Pages UI, add D1 binding in **Pages → Settings → Functions → D1 bindings** with:
- Variable name: `DB`
- Database: `suvojeet-db`

### Admin auth setup (secure email/password login)
1. Generate password hash:
   ```bash
   npm run hash:admin-password -- "YOUR_ADMIN_PASSWORD"
   ```
   This generates a PBKDF2-SHA256 hash with **100000 iterations** (Cloudflare runtime limit).
2. Copy `.dev.vars.example` to `.dev.vars` for local development and fill:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH` (generated hash)
   - `ADMIN_DISPLAY_NAME`
   - `SESSION_TTL_HOURS`
3. In Cloudflare Pages production, add the same values in **Settings → Environment variables / secrets**.

Password is verified using PBKDF2-SHA256 hash, and admin session uses secure HTTP-only cookie with D1-backed session records.

## Contact and Connect

For collaborations in software development or musical performances, please use the following channels:

- **GitHub**: [suvojeet-sengupta](https://github.com/suvojeet-sengupta)
- **YouTube**: [suvojeetsengupta](https://youtube.com/@suvojeetsengupta)
- **Website**: [suvojeetsengupta.in](https://suvojeetsengupta.in)

License: MIT
Copyright (c) 2026 Suvojeet Sengupta
