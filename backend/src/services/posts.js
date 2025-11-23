// backend/src/services/posts.js
import { Post } from "../db/models/post.js";

// CREATE – jetzt mit image!
export async function createPost({ title, author, contents, tags = [], image = null }) {
  const post = new Post({
    title,
    author,
    contents,
    tags,
    image,        // ← wird jetzt gespeichert
  })
  return await post.save()
}

// UPDATE – auch mit image
export async function updatePost(postId, { title, author, contents, tags, image }) {
  const updateData = { title, author, contents, tags }
  
  // Nur image hinzufügen, wenn es übergeben wurde (auch wenn es leer ist → löschen)
  if (image !== undefined) {
    updateData.image = image
  }

  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: updateData },
    { new: true }
  )
}

// LIST – sortOrder fix (Mongoose will -1 oder 1, nicht "descending")
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {}
) {
  const sort = sortOrder === 'descending' ? -1 : 1
  return await Post.find(query).sort({ [sortBy]: sort })
}

// Die anderen Funktionen bleiben gleich
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