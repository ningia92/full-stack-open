const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

const newUserToken = async () => {
  const newUser = {
    username: 'elBarto',
    name: 'Bart Simpson',
    password: 'secret'
  }

  await api
    .post('/api/users')
    .send(newUser)

  const response = await api
    .post('/api/login')
    .send(newUser)

  return response.body.token
}

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blog posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToCheck = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToCheck.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(Object.hasOwn(resultBlog.body, 'id'))
  })

  describe('addition of a new blog post', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'blogTest3',
        author: 'authorTest3',
        url: 'urlTest3',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await newUserToken()}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const blogs = blogsAtEnd.map(b => b.title)
      assert(blogs.includes('blogTest3'))
    })

    test('if likes property value is missing, its value is 0', async () => {
      const newBlog = {
        title: 'blogTest4',
        author: 'authorTest4',
        url: 'urlTest4'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await newUserToken()}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
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
        .set('Authorization', `Bearer ${await newUserToken()}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('if url property is missing, respond with status code 400 bad request', async () => {
      const newBlog = {
        title: 'titleTest',
        author: 'authorTest'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await newUserToken()}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const newBlog = {
        title: 'blogTest5',
        author: 'authorTest5',
        url: 'urlTest5'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await newUserToken()}`)
        .send(newBlog)

      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${await newUserToken()}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const blogs = blogsAtEnd.map(b => b.title)
      assert(!blogs.includes(response.body.title))
    })
  })

  describe('update of a blog post', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const newBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

      assert(updatedBlog.likes === newBlog.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})