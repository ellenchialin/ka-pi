import { useEffect, useRef } from 'react'
import { Input } from '@chakra-ui/react'
import PropTypes from 'prop-types'

function BlogTitle({ blogTitle, setBlogTitle }) {
  const titleInputRef = useRef(null)
  useEffect(() => {
    titleInputRef.current.focus()
  }, [])

  return (
    <Input
      variant="filled"
      type="text"
      placeholder="Blog Title"
      mb="6"
      size="lg"
      value={blogTitle}
      onChange={e => setBlogTitle(e.target.value)}
      ref={titleInputRef}
      isRequired
    />
  )
}

BlogTitle.propTypes = {
  blogTitle: PropTypes.string.isRequired,
  setBlogTitle: PropTypes.func.isRequired,
}

export default BlogTitle
