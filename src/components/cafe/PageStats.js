import PropTypes from 'prop-types'
import { Box, HStack, Text, Icon } from '@chakra-ui/react'
import { BsFillBookmarkFill, BsEyeFill } from 'react-icons/bs'

function PageStats({ savedNumber, pageViews }) {
  return (
    <Box alignSelf="flex-end">
      <HStack>
        <HStack align="center">
          <Text>{savedNumber}</Text>
          <Icon as={BsFillBookmarkFill} />
        </HStack>
        <HStack align="center">
          <Text>{pageViews}</Text>
          <Icon as={BsEyeFill} />
        </HStack>
      </HStack>
    </Box>
  )
}

PageStats.propTypes = {
  savedNumber: PropTypes.number.isRequired,
  pageViews: PropTypes.number.isRequired,
}

export default PageStats
