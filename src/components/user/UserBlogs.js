import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Text, SimpleGrid, Icon, HStack, useToast } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import { firebase } from '../../utils/firebase'
import BlogCard from '../cafe/BlogCard'
import CustomPagination from '../../components/shared/CustomPagination'

function UserBlogs({ currentUserId }) {
  const [canDeleteBlog] = useState(true)
  const [userBlogs, setUserBlogs] = useState([])

  const scrollToTopRef = useRef(null)
  const successToast = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(10)
  const offset = (currentPage - 1) * cardsPerPage
  const currentBlogs = userBlogs.slice(offset, offset + cardsPerPage)

  useEffect(() => {
    firebase
      .getUserBlogs(currentUserId)
      .then(blogs => setUserBlogs(blogs))
      .catch(error => console.error(error.message))
  }, [])

  const deleteBlog = (cafeId, blogId) => {
    firebase
      .deleteUserBlog(cafeId, blogId)
      .then(() => {
        const updatedList = userBlogs.filter(blog => blog.blogId !== blogId)
        setUserBlogs(updatedList)

        successToast({
          position: 'top-right',
          duration: 3000,
          render: () => (
            <HStack
              spacing="4"
              color="primaryDark"
              p={3}
              bg="teal.200"
              borderRadius="md"
            >
              <Icon as={CheckCircleIcon} />
              <Text>成功刪除食記</Text>
            </HStack>
          ),
          isClosable: true,
        })
      })
      .catch(error => console.error(error.message))
  }

  return (
    <>
      <Text mb="3" ref={scrollToTopRef}>
        {userBlogs.length > 0
          ? `${userBlogs.length} Blogs`
          : '尚未發佈任何食記'}
      </Text>
      <Flex w="full" direction="column">
        <SimpleGrid
          w="full"
          minChildWidth="270px"
          spacing="20px"
          justifyItems="center"
          mb="4"
        >
          {currentBlogs.length > 0 &&
            currentBlogs.map(blog => (
              <BlogCard
                key={blog.blogId}
                blog={blog}
                canDeleteBlog={canDeleteBlog}
                handleBlogDelete={() => deleteBlog(blog.cafeId, blog.blogId)}
              />
            ))}
        </SimpleGrid>
        {userBlogs.length > cardsPerPage && (
          <CustomPagination
            total={userBlogs.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            cardsPerPage={cardsPerPage}
            scrollToTopRef={scrollToTopRef}
          />
        )}
      </Flex>
    </>
  )
}

UserBlogs.propTypes = {
  currentUserId: PropTypes.string.isRequired,
}

export default UserBlogs
