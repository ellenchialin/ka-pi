import PropTypes from 'prop-types'
import Pagination from '@choc-ui/paginator'

function CustomPagination({
  total,
  currentPage,
  setCurrentPage,
  cardsPerPage,
  scrollToTopRef,
}) {
  const handlePageChange = page => {
    setCurrentPage(page)
    scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Pagination
      defaultCurrent={1}
      total={total}
      current={currentPage}
      onChange={page => handlePageChange(page)}
      pageSize={cardsPerPage}
      paginationProps={{
        display: 'flex',
        justifyContent: 'center',
      }}
      pageNeighbours={2}
      rounded="full"
      baseStyles={{ bg: 'transparent' }}
      activeStyles={{ bg: 'gray.400' }}
      hoverStyles={{ bg: 'gray.400' }}
      responsive={{ activePage: true }}
    />
  )
}

CustomPagination.propTypes = {
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  cardsPerPage: PropTypes.number.isRequired,
  scrollToTopRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
}

export default CustomPagination
