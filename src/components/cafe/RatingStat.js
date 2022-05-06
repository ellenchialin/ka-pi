import PropTypes from 'prop-types'
import { Flex, VStack, Text, Divider } from '@chakra-ui/react'

function RatingStat({ feature1, feature2 }) {
  return (
    <Flex
      w="250px"
      maxW={{ base: '300px', md: '500px' }}
      h="100%"
      minH="100px"
      align="center"
      justify="center"
      p="2"
    >
      <Flex w="100%" justify="space-evenly" align="center">
        <VStack spacing="5px" align="flex-start">
          <Text>{feature1.name}</Text>
          <Flex w="full" align="center">
            <Text fontSize="28px" fontWeight="medium" mr="1">
              {feature1.value}
            </Text>
            <Text as="sub">/5</Text>
          </Flex>
        </VStack>

        <Divider
          h="35px"
          borderWidth="2px"
          orientation="vertical"
          colorScheme="secondaryLight"
        />

        <VStack spacing="5px" align="flex-start">
          <Text>{feature2.name}</Text>
          <Flex w="full" align="center">
            <Text fontSize="28px" fontWeight="medium" mr="1">
              {feature2.value}
            </Text>
            <Text as="sub">/5</Text>
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  )
}

RatingStat.propTypes = {
  feature1: PropTypes.object,
  feature2: PropTypes.object,
}

export default RatingStat
