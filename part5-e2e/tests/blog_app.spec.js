const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    };
    await request.post('http://localhost:3001/api/users').send(newUser);

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click();
    await expect(page.locator('form')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click();
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'testpassword');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Test User logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click();
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'wrongpassword');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Wrong username or password!')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create Blog' }).click();
      await page.fill('input[name="Title"]', 'My New Blog');
      await page.fill('input[name="Author"]', 'John Doe');
      await page.fill('input[name="Url"]', 'http://example.com');
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.getByText('My New Blog John Doe')).toBeVisible();
    });
  });

  test('a blog can be liked', async ({ page }) => {
    await page.getByText('Blog to be liked Jane Doe').click();

    const likeButton = page.getByRole('button', { name: 'Like' });
    const likesCount = page.locator('.likes');

    const initialLikes = await likesCount.innerText();

    await likeButton.click();

    await expect(likesCount).toHaveText(`${parseInt(initialLikes) + 1}`);
  });
});
