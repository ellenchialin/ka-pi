import { IconButton } from '@chakra-ui/react'
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs'
import PropTypes from 'prop-types'

function SaveCafeButton({ toggleSaved, handleToggleSaved }) {
  return (
    <IconButton
      position="absolute"
      top="-20px"
      right="20px"
      colorScheme="teal"
      isRound={true}
      aria-label="收藏到我的咖啡廳地圖"
      icon={
        toggleSaved ? (
          <BsFillBookmarkFill size="22px" />
        ) : (
          <BsBookmark size="22px" />
        )
      }
      onClick={handleToggleSaved}
    />
  )
}

SaveCafeButton.propTypes = {
  toggleSaved: PropTypes.bool.isRequired,
  handleToggleSaved: PropTypes.func.isRequired,
}

export default SaveCafeButton
