import { NavLink } from 'react-router-dom'
import { Link, HStack, useColorModeValue, chakra } from '@chakra-ui/react'

const PageButton = props => {
  const activeStyle = {
    bg: useColorModeValue('primaryDark', 'primaryDark'),
  }
  return (
    <chakra.link
      mx="1"
      p="4"
      rounded="md"
      bg="primaryLight"
      color="primaryDark"
      opacity={props.disabled && 0.6}
      _hover={!props.disabled && activeStyle}
      cursor={props.disabled && 'not-allowed'}
      {...(props.active && activeStyle)}
    >
      {props.children}
    </chakra.link>
  )
}

function Pagination({ cafesPerPage, totalCafes, paginate }) {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalCafes / cafesPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <HStack as="nav" spacing="2" my="4">
      {pageNumbers.map(number => (
        <Link
          key={number}
          as={NavLink}
          to={`#page=${number}`}
          onClick={() => paginate(number)}
          bg="primaryLight"
          color="primaryDark"
          size="sm"
          textAlign="center"
          borderRadius="full"
          boxShadow="base"
          _hover={{ textDecoration: 'none', bg: 'secondaryLight' }}
        >
          {number}
        </Link>
      ))}
    </HStack>
  )
}

export default Pagination
