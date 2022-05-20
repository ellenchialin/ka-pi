import { Spinner } from '@chakra-ui/react'

function CustomSpinner() {
  return (
    <Spinner
      thickness="5px"
      speed="0.65s"
      emptyColor="gray.200"
      color="teal"
      size="lg"
      mt="6"
    />
  )
}

export default CustomSpinner
