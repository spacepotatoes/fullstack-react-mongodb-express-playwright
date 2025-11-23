import PropTypes from 'prop-types'

// src/components/Post.jsx
export function Post({ title, contents, author, createdAt, image }) {
  return (
    <article className="group relative h-full flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Bild – jetzt echt aus DB */}
      <div className="aspect-[4/3] bg-gray-200">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium">
            No image
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <span className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full">
            Blog
          </span>
          <span className="px-4 py-1.5 text-xs font-bold bg-gray-200 dark:bg-gray-700 rounded-full">
            React
          </span>
        </div>

        {/* Titel */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          {title}
        </h3>

        {/* Text */}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1">
          {contents}
        </p>

        {/* Author + Datum */}
        <div className="mt-6 flex items-center gap-4 text-sm">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {author[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
            <p className="text-gray-500 dark:text-gray-400">
              {new Date(createdAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    autor: PropTypes.string,
}