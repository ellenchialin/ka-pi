import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
// prettier-ignore
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

function CustomBreadcrumb({ secondDestination, currentDestinationText }) {
  const { secondUrl, secondText } = secondDestination

  return (
    <Breadcrumb
      spacing="2px"
      separator={<ChevronRightIcon color="secondaryLight" />}
      mb="4"
      fontSize="14px"
    >
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/">
          首頁
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to={secondUrl}>
          {secondText}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink
          cursor="not-allowed"
          color="secondaryLight"
          textDecoration="underline"
        >
          {currentDestinationText}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

CustomBreadcrumb.propTypes = {
  secondDestination: PropTypes.shape({
    secondUrl: PropTypes.string.isRequired,
    secondText: PropTypes.string.isRequired,
  }),
  currentDestinationText: PropTypes.string.isRequired,
}

export default CustomBreadcrumb
