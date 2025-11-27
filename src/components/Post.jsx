// src/components/Post.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost, updatePost } from '../api/posts.js'
import { CreatePost } from './CreatePost.jsx'

export function Post({
  _id,
  title,
  contents,
  author,
  createdAt,
  image: initialImage,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(_id),
    onSuccess: () => {
      queryClient.setQueriesData(
        { predicate: (query) => query.queryKey[0] === 'posts' },
        (old) => old?.filter((p) => p._id !== _id) ?? old,
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => updatePost(_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setIsEditing(false)
    },
  })

  const handleDelete = () => {
    if (window.confirm('Post wirklich löschen?')) {
      deleteMutation.mutate()
    }
  }

  // === EDIT-MODUS ===
  if (isEditing) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-2xl mb-6'>Post bearbeiten</h2>
          <CreatePost
            initialData={{ title, contents, author, image: initialImage }}
            onSave={(data) => updateMutation.mutate(data)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    )
  }

  // === NORMALER ANZEIGE-MODUS ===
  return (
    <article className='group relative h-full flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500'>
      {/* Edit & Delete Buttons */}
      <div className='absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
        <button
          onClick={() => setIsEditing(true)}
          className='btn btn-sm btn-circle btn-info tooltip tooltip-left'
          data-tip='Bearbeiten'
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className='btn btn-sm btn-circle btn-error tooltip tooltip-left'
          data-tip='Löschen'
        >
          {deleteMutation.isPending ? (
            <span className='loading loading-spinner loading-xs'></span>
          ) : (
            'Delete'
          )}
        </button>
      </div>

      {/* Bild */}
      <div className='aspect-[4/3] bg-gray-200 relative'>
        {initialImage ? (
          <img
            src={initialImage}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium text-lg'>
            No image
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className='p-6 flex-1 flex flex-col'>
        <div className='flex gap-2 mb-4'>
          <span className='px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full'>
            Blog
          </span>
        </div>

        <h3 className='text-xl font-bold mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors'>
          {title}
        </h3>
        <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1'>
          {contents}
        </p>

        <div className='mt-6 flex items-center gap-4 text-sm'>
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg'>
            {author[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className='font-semibold text-gray-900 dark:text-white'>
              {author}
            </p>
            <p className='text-gray-500 dark:text-gray-400'>
              {new Date(createdAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  image: PropTypes.string,
}
