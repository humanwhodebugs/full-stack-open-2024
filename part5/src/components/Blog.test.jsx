// src/tests/Blog.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Blog from '../components/Blog';
import { describe, it, expect } from 'vitest';

describe('Blog component', () => {
  const blog = {
    id: '12345',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mchan',
      name: 'Michael Chan',
    },
  };

  it('renders title and author but not url or likes by default', () => {
    render(
      <Blog blog={blog} user={{ username: 'mchan' }} setBlogs={() => {}} />
    );

    // Check if title and author are rendered
    const titleAuthorElement = screen.getByText('React patterns Michael Chan');
    expect(titleAuthorElement).toBeVisible();

    // Check if url and likes are not rendered by default
    const urlElement = screen.queryByText('https://reactpatterns.com/');
    const likesElement = screen.queryByText('Likes 7');

    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();
  });

  it('shows url and likes when the view button is clicked', () => {
    render(
      <Blog blog={blog} user={{ username: 'mchan' }} setBlogs={() => {}} />
    );

    // Find and click the view button
    const viewButton = screen.getByText('View');
    fireEvent.click(viewButton);

    // Now url and likes should be visible
    const urlElement = screen.getByText('https://reactpatterns.com/');
    const likesElement = screen.getByText('Likes 7');

    expect(urlElement).toBeVisible();
    expect(likesElement).toBeVisible();
  });
});
