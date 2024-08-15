import { render, screen } from '@testing-library/react';
import Blog from '../components/Blog';
import { describe, it, expect } from 'vitest';

describe('Blog component', () => {
  it('renders title and author but not url or likes by default', () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: {
        username: 'mchan',
        name: 'Michael Chan',
      },
    };

    render(
      <Blog
        blog={{ ...blog, id: '12345' }}
        user={{ username: 'mchan' }}
        setBlogs={() => {}}
      />
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
});
