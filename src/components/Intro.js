// prettier-ignore
import { Flex, Text, HStack, VStack, IconButton, keyframes, usePrefersReducedMotion } from '@chakra-ui/react'
import { BsChevronDoubleDown } from 'react-icons/bs'

const arrowAnimation = keyframes`
 0%, 20%, 50%, 80%, 100% { transform: translateY(0)}
 40% { transform: translateY(10px)}
`

function Intro({ handleScroll }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const animation = prefersReducedMotion
    ? undefined
    : `${arrowAnimation} infinite 2s ease-in-out`

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
        <IconButton
          icon={<BsChevronDoubleDown />}
          fontSize="20px"
          cursor="pointer"
          animation={animation}
          _hover={{ transform: 'scale(1.2)' }}
          transition="transform 450ms ease"
          onClick={handleScroll}
          isRound
        />
      </VStack>
    </Flex>
  )
}

export default Intro
