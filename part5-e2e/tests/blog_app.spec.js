const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');

    const user1 = {
      username: 'user1',
      name: 'User One',
      password: 'password1',
    };
    const user2 = {
      username: 'user2',
      name: 'User Two',
      password: 'password2',
    };
    await request.post('http://localhost:3001/api/users').send(user1);
    await request.post('http://localhost:3001/api/users').send(user2);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="Username"]', 'user1');
    await page.fill('input[name="Password"]', 'password1');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('button', { name: 'Create Blog' }).click();
    await page.fill('input[name="Title"]', 'Blog created by user1');
    await page.fill('input[name="Author"]', 'User One');
    await page.fill('input[name="Url"]', 'http://example.com');
    await page.getByRole('button', { name: 'Create' }).click();

    await page.getByRole('button', { name: 'Logout' }).click();
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

  test('the user who added the blog can delete it', async ({ page }) => {
    await page.getByText('Blog to be deleted John Doe').click();

    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(
      page.getByText('Blog to be deleted John Doe')
    ).not.toBeVisible();
  });

  describe('When logged in as a different user', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');

      await page.getByRole('button', { name: 'log in' }).click();
      await page.fill('input[name="Username"]', 'user2');
      await page.fill('input[name="Password"]', 'password2');
      await page.getByRole('button', { name: 'Login' }).click();
    });

    test('the delete button is not visible to users who did not create the blog', async ({
      page,
    }) => {
      await page.getByText('Blog created by user1 User One').click();

      await expect(
        page.getByRole('button', { name: 'Remove' })
      ).not.toBeVisible();
    });
  });
});
