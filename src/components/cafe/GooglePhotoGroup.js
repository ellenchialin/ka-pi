import PropTypes from 'prop-types'
import { Flex, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import GooglePhotoCard from './GooglePhotoCard'

function GooglePhotoGroup({ googlePhotoRefs }) {
  const subtagTextColor = useColorModeValue('thirdDark', 'secondaryLight')

  return (
    <Flex w="100%" direction="column" mb="16">
      <Text color={subtagTextColor}>快速導覽</Text>
      <Text fontSize={{ base: '20px', md: '24px' }} fontWeight="bold" mb="6">
        Google 評論照片
      </Text>
      <SimpleGrid
        w="full"
        spacing={{ base: '10px', sm: '20px' }}
        minChildWidth="220px"
        justifyItems="center"
      >
        {googlePhotoRefs.length > 0 ? (
          googlePhotoRefs.map(ref => (
            <GooglePhotoCard key={ref} photoRef={ref} />
          ))
        ) : (
          <Text color={subtagTextColor}>Google 評論暫無提供資料</Text>
        )}
      </SimpleGrid>
    </Flex>
  )
}

GooglePhotoGroup.propTypes = {
  googlePhotoRefs: PropTypes.array.isRequired,
}

export default GooglePhotoGroup
