import PropTypes from 'prop-types'
import { Flex, VStack, Text, Button, useColorModeValue } from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'
import BlogCard from './BlogCard'

function BlogGroup({ blogs, handleClickAddBlog }) {
  const subtagTextColor = useColorModeValue('thirdDark', 'secondaryLight')

  return (
    <Flex w="full" direction="column" mb="16">
      <Flex w="full" justify="space-between" align="end" mb="6">
        <VStack align="flex-start" spacing="0">
          <Text color={subtagTextColor}>店內細節</Text>
          <Text
            fontSize={{ base: '20px', md: '24px' }}
            fontWeight="bold"
            mt="0"
          >
            網友真實體驗
          </Text>
        </VStack>
        <Button
          leftIcon={<RiAddFill />}
          size="sm"
          h="9"
          fontSize="16px"
          onClick={handleClickAddBlog}
        >
          撰寫食記
        </Button>
      </Flex>

      <Flex
        w="full"
        justify={{ base: 'center', md: 'stretch' }}
        wrap="wrap"
        gap="8"
      >
        {blogs.length > 0 ? (
          blogs.map(blog => <BlogCard key={blog.blogId} blog={blog} />)
        ) : (
          <Text w="full" color={subtagTextColor} textAlign="center">
            尚未有任何食記
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

BlogGroup.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleClickAddBlog: PropTypes.func.isRequired,
}

export default BlogGroup
