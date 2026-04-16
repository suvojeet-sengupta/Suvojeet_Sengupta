import { expect, test } from '@playwright/test';

const mockedPost = {
  id: 999,
  title: 'E2E Visible Blog Post',
  slug: 'e2e-visible-post',
  excerpt: 'Deterministic fixture for end-to-end testing.',
  category: 'Testing',
  imageUrl: null,
  publishedAt: '2026-01-01T00:00:00.000Z',
  views: 42,
  likes: 3,
  author: 'Suvojeet Sengupta',
  tags: ['e2e'],
  commentsEnabled: true,
  commentsCount: 0,
};

test('blog list and post visibility smoke', async ({ page }) => {
  await page.route('**/api/public/posts', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ posts: [mockedPost] }),
    });
  });

  await page.goto('/blog');

  await expect(page.getByRole('heading', { name: 'Latest Posts' })).toBeVisible();
  await expect(page.getByRole('heading', { name: mockedPost.title })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read post' })).toHaveAttribute('href', '/blog/e2e-visible-post');

  await page.goto('/blog/e2e-visible-post');
  await expect(page.getByRole('heading', { name: mockedPost.title })).toBeVisible();
  await expect(page.getByText('Deterministic fixture for end-to-end testing.')).toBeVisible();
});
