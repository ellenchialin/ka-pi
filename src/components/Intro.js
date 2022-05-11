import { Flex, Text, HStack, VStack, Icon } from '@chakra-ui/react'
import { BiChevronDownCircle } from 'react-icons/bi'

function Intro({ handleScroll }) {
  return (
    <Flex
      as="section"
      maxW="600px"
      h="90vh"
      direction="column"
      justify="center"
      mb="12"
    >
      <Text fontSize={{ base: '40px', md: '60px' }} fontWeight="bold">
        Coffee
      </Text>
      <HStack mb="2">
        <Text as="i" fontWeight="bold">{`[ ka-pi ]`}</Text>
        <Text>noun.</Text>
      </HStack>
      <Text>
        A magical brown liquid, ground from beans and necessary for human life.
      </Text>
      <VStack mt="32">
        <Text>Get me a cuppa NOW</Text>
        <Icon
          as={BiChevronDownCircle}
          fontSize="28px"
          cursor="pointer"
          _hover={{ transform: 'scale(1.2)' }}
          transition="transform 450ms ease"
          onClick={handleScroll}
        />
      </VStack>
    </Flex>
  )
}

export default Intro
