import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CityHeader from '../CityHeader'

test('render city name passed into city prop', async () => {
  render(<CityHeader city="Taipei" />)
  const headingElement = screen.getByText(/taipei/i)
  expect(headingElement).toBeInTheDocument()
})
