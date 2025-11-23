// src/Blog.jsx
import { useState } from 'react'
import { useDeferredValue } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PostList } from './components/PostList.jsx'
import { CreatePost } from './components/CreatePost.jsx'
import { getPosts } from './api/posts.js'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const debouncedAuthor = useDeferredValue(author)

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', debouncedAuthor, sortBy, sortOrder],
    queryFn: () => getPosts({ author: debouncedAuthor, sortBy, sortOrder }),
    keepPreviousData: true,
  })

  return (
    <div className="min-h-screen bg-base-200">
      {/* EINZIGER CONTAINER – ALLES DRIN, ALLES ZENTRiert */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header + CreatePost */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            My Blog
          </h1>
          <CreatePost />
        </div>

        {/* Pill-Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['Alle', 'Daniel Bugl', 'Giuseppe Troiano'].map(name => (
            <button
              key={name}
              onClick={() => setAuthor(name === 'Alle' ? '' : name)}
              className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide border-2 transition-all duration-300
                ${author === (name === 'Alle' ? '' : name)
                  ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white border-transparent shadow-xl scale-105'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-pink-400 text-gray-800 dark:text-gray-200'
                }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Filter + Sort – sauber und zentriert */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-3">
              Filter by author
            </label>
            <input
              type="text"
              placeholder="Enter author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input input-bordered w-full rounded-2xl h-12 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-base-content/80 mb-3">
              Sort posts
            </label>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered flex-1 rounded-2xl"
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="select select-bordered rounded-2xl"
              >
                <option value="descending">Newest First</option>
                <option value="ascending">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts – jetzt endlich 3 nebeneinander! */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <span className="loading loading-spinner loading-lg text-pink-500"></span>
          </div>
        ) : (
          <PostList posts={posts} />
        )}

      </div>
    </div>
  )
}