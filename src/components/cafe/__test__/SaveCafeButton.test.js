import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SaveCafeButton from '../SaveCafeButton'

describe('save cafe button', () => {
  test('render component on the screen', () => {
    const mockedSaveClick = jest.fn()
    render(
      <SaveCafeButton toggleSaved={true} handleToggleSaved={mockedSaveClick} />
    )
    const buttonElement = screen.getByRole('button')
    expect(buttonElement).toBeInTheDocument()
  })

  test('call handleToggleSaved porp when button clicked', () => {
    const mockedSaveClick = jest.fn()
    render(
      <SaveCafeButton toggleSaved={true} handleToggleSaved={mockedSaveClick} />
    )
    const buttonElement = screen.getByRole('button')
    fireEvent.click(buttonElement)
    expect(mockedSaveClick).toHaveBeenCalledTimes(1)
  })

  test('call setState when button clicked', () => {
    const mockedSaveClick = jest.fn()
    const mockedsetState = jest.fn()
    const mockeduseState = useState => [useState, mockedsetState]

    jest.spyOn(React, 'useState').mockImplementation(mockeduseState)
    render(
      <SaveCafeButton toggleSaved={true} handleToggleSaved={mockedSaveClick} />
    )
    const buttonElement = screen.getByRole('button')
    fireEvent.click(buttonElement)
    expect(mockedsetState).toHaveBeenCalledTimes(1)
  })
})
