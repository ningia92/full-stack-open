import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect, test, vi } from 'vitest'

describe('test BlogForm component', () => {
  test('calls event handler with right details when new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'testTitle')
    await user.type(authorInput, 'testAuthor')
    await user.type(urlInput, 'testUrl')

    await user.click(submitButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl'
    })
  })
})