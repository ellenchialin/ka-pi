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
          <Text fontSize="0.875rem">{feature1.name}</Text>
          <Text fontSize="1.5rem">{feature1.value}</Text>
        </VStack>

        <Divider
          size="1em"
          h="50px"
          orientation="vertical"
          colorScheme="blackAlpha"
        />

        <VStack spacing="5px" align="flex-start">
          <Text fontSize="0.875rem">{feature2.name}</Text>
          <Text fontSize="1.5rem">{feature2.value}</Text>
        </VStack>
      </Flex>
    </Flex>
  )
}

export default RatingStat
