import { Heading } from '@chakra-ui/react'
import PropTypes from 'prop-types'

function CityHeader({ city }) {
  return (
    <Heading as="h1" size="xl">
      {city}
    </Heading>
  )
}

CityHeader.propTypes = {
  city: PropTypes.string.isRequired,
}

export default CityHeader
