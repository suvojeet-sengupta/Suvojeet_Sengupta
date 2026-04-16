import { expect, test } from '@playwright/test';

test('like interaction updates UI deterministically', async ({ page }) => {
  let liked = false;

  await page.route('**/api/public/posts/e2e-visible-post/like', async (route) => {
    liked = !liked;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ liked }),
    });
  });

  await page.goto('/blog/e2e-visible-post');

  const likeButton = page.getByRole('button', { name: /like|liked/i }).first();

  await expect(likeButton).toContainText('3');
  await likeButton.click();
  await expect(likeButton).toContainText('4');
  await likeButton.click();
  await expect(likeButton).toContainText('3');
});
