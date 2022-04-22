import React from 'react'
import { Flex, Link } from '@chakra-ui/react'

function Pagination({ cafesPerPage, totalCafes, paginate }) {
  const pageNumbers = []

  // console.log('Total cafes in pagination: ', totalCafes)

  for (let i = 1; i <= Math.ceil(totalCafes / cafesPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <Flex as="nav">
      {pageNumbers.map(number => (
        <Link
          key={number}
          href={`#page=${number}`}
          onClick={() => paginate(number)}
        >
          {number}
        </Link>
      ))}
    </Flex>
  )
}

export default Pagination
