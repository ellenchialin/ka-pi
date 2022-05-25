import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogTitle from '../BlogTitle'

const mockedsetState = jest.fn()

describe('edit blog component', () => {
  test('render blog title input', () => {
    render(<BlogTitle blogTitle={''} setBlogTitle={mockedsetState} />)
    const inputElement = screen.getByPlaceholderText(/Blog Title/i)
    expect(inputElement).toBeInTheDocument()
  })
})
