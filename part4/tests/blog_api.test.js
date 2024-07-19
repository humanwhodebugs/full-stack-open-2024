const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const helper = require('./test_helper');

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

test('Blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Unique identifier property of the blog posts is named id', async () => {
  const response = api.get('/api/blogs');
  const blogs = (await response).body;

  blogs.forEach((blog) => {
    assert(blog.id, 'Blog should have an id property');
    assert(!blog._id, 'Blog should not have an _id property');
  });
});

test('Making an HTTP post', async () => {
  const newBlog = {
    title: 'Testing HTTP post',
    author: 'Nobody',
    url: 'http://testing.com',
    likes: 20,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const titles = blogs.map((r) => r.title);

  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
  assert(titles.includes('Testing HTTP post'));
});

after(async () => {
  await mongoose.connection.close();
});
