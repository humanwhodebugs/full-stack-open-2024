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

after(async () => {
  await mongoose.connection.close();
});
