import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

describe('test Blog component', () => {
  const blog = {
    title: 'testBlog',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 1,
    user: {
      username: 'testUsername',
      name: 'testName'
    },
  }

  const mockAddLike = vi.fn()
  const mockRemoveBlog = vi.fn()

  test('renders title and author but does not render url and likes', () => {
    render(<Blog blog={blog} addLike={mockAddLike} mockRemoveBlog={mockRemoveBlog} username={blog.user.username} />)

    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined()
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()
  })

  test('url and likes are shown when the button controlling the shown details is clicked', async () => {
    render(<Blog blog={blog} addLike={mockAddLike} mockRemoveBlog={mockRemoveBlog} username={blog.user.username} />)

    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
  })

  test('like button is clicked twice, event handler is called twice', async () => {
    render(<Blog blog={blog} addLike={mockAddLike} removeBlog={mockRemoveBlog} username={blog.user.username} />)

    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockAddLike.mock.calls).toHaveLength(2)
  })
})