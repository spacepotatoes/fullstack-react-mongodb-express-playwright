// src/components/PostList.jsx
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'



export function PostList({ posts = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {posts.map(post => (
        <Post key={post._id} {...post} />   // ← image wird automatisch mitgegeben
      ))}
    </div>
  )
}

PostList.propTypes = {
posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).
isRequired,
}