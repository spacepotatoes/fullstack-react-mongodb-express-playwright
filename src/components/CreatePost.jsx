// src/components/CreatePost.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts.js'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [contents, setContents] = useState('')
  const [image, setImage] = useState('') // ← Base64-String
  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationFn: () => createPost({ title, author, contents, image }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setTitle('')
      setAuthor('')
      setContents('')
      setImage('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !author || !contents) return
    createPostMutation.mutate()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Optional: nur Bilder bis 5MB erlauben
    if (file.size > 5 * 1024 * 1024) {
      alert('Bild zu groß – max. 5 MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result) // Base64-String
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 bg-base-100 p-8 rounded-3xl shadow-2xl">

        {/* Title */}
        <div>
          <label className="label">
            <span className="label-text text-lg font-semibold">Title</span>
          </label>
          <input
            type="text"
            placeholder="My awesome blog post..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered input-lg w-full text-2xl font-bold"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="label">
            <span className="label-text text-lg font-semibold">Your Name</span>
          </label>
          <input
            type="text"
            placeholder="Daniel Bugl"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="label">
            <span className="label-text text-lg font-semibold">Featured Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered file-input-primary w-full"
          />

          {/* Vorschau */}
          {image && (
            <div className="mt-6 relative">
              <img
                src={image}
                alt="Preview"
                className="rounded-2xl max-h-96 mx-auto shadow-xl"
              />
              <button
                type="button"
                onClick={() => setImage('')}
                className="btn btn-circle btn-error btn-sm absolute top-4 right-4"
              >
                X
              </button>
            </div>
          )}
        </div>

        {/* Contents */}
        <div>
          <label className="label">
            <span className="label-text text-lg font-semibold">Content</span>
          </label>
          <textarea
            placeholder="Write your story..."
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={10}
            className="textarea textarea-bordered w-full text-lg leading-relaxed"
            required
          />
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={createPostMutation.isPending || !title || !author || !contents}
            className="btn btn-primary btn-lg w-full text-xl font-bold"
          >
            {createPostMutation.isPending ? (
              <>
                <span className="loading loading-spinner"></span>
                Creating...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        </div>

        {/* Success Message */}
        {createPostMutation.isSuccess && (
          <div className="alert alert-success shadow-lg">
            <span>Post created successfully!</span>
          </div>
        )}

        {createPostMutation.isError && (
          <div className="alert alert-error shadow-lg">
            <span>Error: {createPostMutation.error.message}</span>
          </div>
        )}
      </form>
    </div>
  )
}