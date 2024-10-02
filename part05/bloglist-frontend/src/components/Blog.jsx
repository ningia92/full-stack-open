import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, username }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
    const buttonLabel = detailsVisible ? 'show' : 'hide'
  }

  const handleLike = () => {
    const newBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    addLike(newBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{!detailsVisible ? 'show' : 'hide'}</button>
      </div>
      {detailsVisible && (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <div>
            likes {blog.likes}
            <button id="like-button" onClick={handleLike}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          {username === blog.user.username && (
            <button id="remove-button" onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog