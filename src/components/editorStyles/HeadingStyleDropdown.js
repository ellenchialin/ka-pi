import { Select } from '@chakra-ui/react'

const BLOCK_TYPE_HEADINGS = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
]

const HeadingStyleDropdown = ({ onToggle, active }) => {
  const onToggleChange = e => {
    let value = e.target.value
    onToggle(value)
  }

  return (
    <>
      <Select
        value={active}
        onChange={onToggleChange}
        variant="filled"
        placeholder="Heading Levels"
      >
        {BLOCK_TYPE_HEADINGS.map(heading => (
          <option key={heading.label} value={heading.style}>
            {heading.label}
          </option>
        ))}
      </Select>
    </>
  )
}

export default HeadingStyleDropdown
