import { render, screen } from '@testing-library/react'
import CafeHeader from '../CafeHeader'

const mockedSetToggleSaved = jest.fn()

test('calls onClick prop when clicked', () => {
  render(<CafeHeader />)
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toBeInTheDocument()
})
