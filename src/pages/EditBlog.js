import { useParams } from 'react-router-dom'

function EditBlog() {
  const { blogId } = useParams()
  console.log(blogId)

  return <div>EditBlog</div>
}

export default EditBlog
