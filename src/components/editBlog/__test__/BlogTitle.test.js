import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogTitle from '../BlogTitle'

const mockedsetState = jest.fn()

describe('edit blog component', () => {
  test('render blog title input', () => {
    render(<BlogTitle blogTitle={''} setBlogTitle={mockedsetState} />)
    const inputElement = screen.getByPlaceholderText(/Blog Title/i)
    expect(inputElement).toBeInTheDocument()
  })

  /*
  test('should be able to type into input', async () => {
    render(<BlogTitle blogTitle={''} setBlogTitle={mockedsetState} />)

    const inputElement = screen.getByRole('textbox')
    await userEvent.type(inputElement, 'Hello')
    expect(inputElement).toHaveValue('Hello')
  })
  */
})
