var _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => (
  blogs.reduce((accumulator, item) => accumulator + item.likes, 0)
)

const favoriteBlog = (blogs) => {
  const max = (item1, item2) => {
    return item1.likes > item2.likes ? item1 : item2
  }

  const { title, author, likes } = blogs.reduce(max, blogs[0])

  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  const result = _.maxBy(_.countBy(blogs, 'author'))
  return { author: result.key, blogs: result.value }
}

const mostLikes = (blogs) => {
  const result = _.sumBy(_.countBy(blogs, 'author'), (blog) => (blog.likes))
  return { author: result.key, likes: result.value }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}