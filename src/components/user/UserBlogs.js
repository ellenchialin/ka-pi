import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// prettier-ignore
import { Flex, Text, SimpleGrid, Icon, HStack, useToast } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import Pagination from '@choc-ui/paginator'

import BlogCard from '../cafe/BlogCard'
import { firebase } from '../../utils/firebase'

function UserBlogs({ currentUserId }) {
  const [canDeleteBlog] = useState(true)
  const [userBlogs, setUserBlogs] = useState([])

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
      <Text mb="3">
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
                cafeId={blog.cafeId}
                blogId={blog.blogId}
                content={blog.content}
                title={blog.title}
                date={blog.createdAt}
                image={blog.image}
                canDeleteBlog={canDeleteBlog}
                handleBlogDelete={() => deleteBlog(blog.cafeId, blog.blogId)}
              />
            ))}
        </SimpleGrid>
        {userBlogs.length > cardsPerPage && (
          <Pagination
            defaultCurrent={1}
            total={userBlogs.length}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
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
        )}
      </Flex>
    </>
  )
}

UserBlogs.propTypes = {
  currentUserId: PropTypes.string.isRequired,
}

export default UserBlogs
