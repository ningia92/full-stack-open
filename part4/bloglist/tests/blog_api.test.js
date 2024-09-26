const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blog posts are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property is named id', async () => {
  const blogsAtStart = await helper.blogInDb()
  const blogToCheck = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToCheck.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(Object.hasOwn(resultBlog.body, 'id'))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'blogTest3',
    author: 'authorTest3',
    url: 'urlTest3',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  assert(blogsAtEnd.some(blog => {
    return blog.title === 'blogTest3' &&
      blog.author === 'authorTest3' &&
      blog.url === 'urlTest3' &&
      blog.likes === 1
  }))
})

test('if likes property value is missing, its value is 0', async () => {
  const newBlog = {
    title: 'blogTest4',
    author: 'authorTest4',
    url: 'urlTest4'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogInDb()
  const addedBlog = blogsAtEnd.find(blog => blog.id === response.body.id)

  assert(addedBlog.likes === 0)
})

test('if title property is missing, respond with status code 400 bad request', async () => {
  const newBlog = {
    author: 'authorTest',
    url: 'urlTest'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('if url property is missing, respond with status code 400 bad request', async () => {
  const newBlog = {
    title: 'titleTest',
    author: 'authorTest'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})