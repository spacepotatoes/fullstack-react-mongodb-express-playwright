// backend/src/services/posts.js
import { Post } from '../db/models/post.js'

// CREATE – jetzt mit contents_large + image
export async function createPost({
  title,
  author,
  contents,
  contents_large,
  tags = [],
  image = null,
}) {
  const post = new Post({
    title,
    author,
    contents,
    contents_large,
    tags,
    image,
  })
  return await post.save()
}

// UPDATE – jetzt auch mit contents_large!
export async function updatePost(
  postId,
  { title, author, contents, contents_large, tags, image },
) {
  const updateData = {
    title,
    author,
    contents,
    tags,
  }

  // Nur hinzufügen, wenn tatsächlich übergeben
  if (contents_large !== undefined) updateData.contents_large = contents_large
  if (image !== undefined) updateData.image = image

  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: updateData },
    { new: true },
  )
}

// Der Rest bleibt unverändert
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const sort = sortOrder === 'descending' ? -1 : 1
  return await Post.find(query).sort({ [sortBy]: sort })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}
export async function listAllPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}
export async function listAllPostsByTag(tags, options) {
  return await listPosts({ tags: { $in: tags } }, options)
}
export async function getPostById(postId) {
  return await Post.findById(postId)
}
export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}
