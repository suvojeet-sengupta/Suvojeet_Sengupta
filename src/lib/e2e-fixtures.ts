import type { BlogPost } from '@/types/blog';

const E2E_SLUG = 'e2e-visible-post';
const E2E_TEST_MODE_ENABLED = process.env.NEXT_PUBLIC_E2E_TEST_MODE === '1';

export function isE2ePostFixtureSlug(slug: string): boolean {
  return E2E_TEST_MODE_ENABLED && slug === E2E_SLUG;
}

export function getE2ePostFixture(): BlogPost {
  return {
    id: 999,
    title: 'E2E Visible Blog Post',
    slug: E2E_SLUG,
    excerpt: 'Deterministic fixture for end-to-end testing.',
    category: 'Testing',
    imageUrl: null,
    publishedAt: '2026-01-01T00:00:00.000Z',
    views: 42,
    likes: 3,
    author: 'Suvojeet Sengupta',
    tags: ['e2e', 'testing'],
    commentsEnabled: true,
    commentsCount: 0,
    content: '<p>This fixture is rendered only in E2E mode.</p>',
    updatedAt: '2026-01-01T00:00:00.000Z',
    comments: [],
    hasLiked: false,
  };
}
