// src/components/CreatePost.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { createPost, updatePost } from '../api/posts.js'
import PropTypes from 'prop-types' // ← NEU: import für PropTypes

export function CreatePost({ initialData = {}, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [contents, setContents] = useState('')
  const [image, setImage] = useState('') // Base64
  const queryClient = useQueryClient()

  // Initialwerte setzen (beim Edit)
  useEffect(() => {
    if (initialData.title) setTitle(initialData.title)
    if (initialData.author) setAuthor(initialData.author)
    if (initialData.contents) setContents(initialData.contents)
    if (initialData.image) setImage(initialData.image)
  }, [initialData])

  const mutation = useMutation({
    mutationFn: initialData._id
      ? (data) => updatePost(initialData._id, data)
      : createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      if (onSave) onSave()
      // Formular zurücksetzen
      setTitle('')
      setAuthor('')
      setContents('')
      setImage('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !author || !contents) return
    mutation.mutate({ title, author, contents, image: image || null })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Bild zu groß – max. 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='space-y-8 bg-base-100 p-8 rounded-3xl shadow-2xl'
      >
        <div>
          <label htmlFor='post-title' className='label'>
            <span className='label-text text-lg font-semibold'>Title</span>
          </label>
          <input
            id='post-title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='input input-bordered input-lg w-full'
            required
          />
        </div>

        <div>
          <label htmlFor='post-author' className='label'>
            <span className='label-text text-lg font-semibold'>Your Name</span>
          </label>
          <input
            id='post-author'
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='input input-bordered w-full'
            required
          />
        </div>

        <div>
          <label htmlFor='post-image' className='label'>
            <span className='label-text text-lg font-semibold'>
              Featured Image
            </span>
          </label>
          <input
            id='post-image'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='file-input file-input-bordered file-input-primary w-full'
          />
          {image && (
            <div className='mt-6 relative'>
              <img
                src={image}
                alt='Preview'
                className='rounded-2xl max-h-96 mx-auto shadow-xl'
              />
              <button
                type='button'
                onClick={() => setImage('')}
                className='btn btn-circle btn-error btn-sm absolute top-4 right-4'
              >
                X
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor='post-content' className='label'>
            <span className='label-text text-lg font-semibold'>Content</span>
          </label>
          <textarea
            id='post-content'
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={10}
            className='textarea textarea-bordered w-full text-lg'
            required
          />
        </div>

        <div className='flex gap-4 pt-6'>
          <button
            type='submit'
            disabled={mutation.isPending}
            className='btn btn-primary btn-lg flex-1'
          >
            {mutation.isPending
              ? 'Saving...'
              : initialData._id
                ? 'Update Post'
                : 'Publish Post'}
          </button>
          {onCancel && (
            <button
              type='button' // ← Typo "button" entfernt
              onClick={onCancel}
              className='btn btn-ghost btn-lg'
            >
              Cancel
            </button>
          )}
        </div>

        {mutation.isError && (
          <div className='alert alert-error'>
            Error: {mutation.error.message}
          </div>
        )}
      </form>
    </div>
  )
}

// ← PropTypes hinzugefügt – die 3 fehlenden Props sind jetzt validiert
CreatePost.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}
