const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'blogTest1',
    author: 'authorTest1',
    url: 'urlTest1',
    likes: 5
  },
  {
    title: 'blogTest2',
    author: 'authorTest2',
    url: 'urlTest2',
    likes: 3
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}