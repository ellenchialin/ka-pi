// prettier-ignore
import { Flex, Text, HStack, VStack, IconButton, keyframes, usePrefersReducedMotion, useColorModeValue } from '@chakra-ui/react'
import { BsChevronDoubleDown } from 'react-icons/bs'
import PropTypes from 'prop-types'

const arrowAnimation = keyframes`
 0%, 100% { transform: translateY(0)}
 50% { transform: translateY(8px)}
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
      <Text
        fontSize={{ base: '40px', md: '60px' }}
        fontWeight="bold"
        letterSpacing="widest"
      >
        咖啡
      </Text>
      <HStack mb="2" fontSize="18px" alignItems="flex-end">
        <Text as="i" fontWeight="bold" fontSize="24px">{`[ ka-pi ]`}</Text>
        <Text>名詞</Text>
      </HStack>
      <Text fontSize={{ base: '18px', md: '20px' }}>
        神奇咖啡色液體，產自豆子，人類生活必需品。
      </Text>
      <VStack mt="32">
        <Text fontSize="18px" fontWeight="bold">
          來一杯
        </Text>
        <IconButton
          icon={<BsChevronDoubleDown />}
          fontSize="20px"
          cursor="pointer"
          animation={animation}
          bg={useColorModeValue('thirdDark', 'primaryLight')}
          color={useColorModeValue('primaryLight', 'primaryDark')}
          _hover={{ opacity: '0.8' }}
          transition="450ms ease"
          onClick={handleScroll}
          isRound
        />
      </VStack>
    </Flex>
  )
}

Intro.propTypes = {
  handleScroll: PropTypes.func.isRequired,
}

export default Intro
