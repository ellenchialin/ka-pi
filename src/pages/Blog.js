import { useParams } from 'react-router-dom'

function Blog() {
  const { blogId } = useParams()

  return <div>Blog</div>
}

export default Blog
