import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageClass, setMessageClass] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage('wrong username or password')
      setMessageClass('error')
      setTimeout(() => {
        setMessage('')
        setMessageClass('')
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`)
      setMessageClass('success')
      setTimeout(() => {
        setMessage('')
        setMessageClass('')
      }, 5000)
    } catch (exception) {
      console.log('Error:', exception.message)
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject)
      const newBlogs = blogs.map(blog => blog.id === blogObject.id ? updatedBlog : blog)
      setBlogs(newBlogs)
    } catch (exception) {
      console.log('Error', exception.message)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      const newBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(newBlogs)
    } catch (exception) {
      console.log('Error', exception.message)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageClass={messageClass} />
      {user === null ?
        <LoginForm handleLogin={handleLogin} /> :
        <div>
          <p> {user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel='new blog'>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <div>
            {blogs
              .sort((blog1, blog2) => blog2.likes - blog1.likes)
              .map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  addLike={updateBlog}
                  removeBlog={deleteBlog}
                  username={user.username}
                />)}
          </div>
        </div>
      }
    </div>
  )
}

export default App