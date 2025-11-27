// src/api/posts.js
const API_URL = import.meta.env.VITE_BACKEND_URL
//const API_URL = '/api';

export const getPosts = async (queryParams = {}) => {
  const res = await fetch(
    `${API_URL}/posts?` + new URLSearchParams(queryParams),
  )
  if (!res.ok) throw new Error('Failed to fetch posts')
  return await res.json()
}

export const createPost = async (post) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
  if (!res.ok) throw new Error('Failed to create post')
  return await res.json()
}

export const updatePost = async (id, post) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to update post')
  }
  return await res.json()
}

export const deletePost = async (id) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  })

  // 200 oder 204 oder 404 – alle ok, solange kein 500
  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ message: 'Network error' }))
    throw new Error(err.error || 'Failed to delete post')
  }

  // 204 hat keinen Body → einfach {} zurückgeben
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return { success: true }
  }

  return await res.json()
}
