// db/models/post.js
import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    contents: { type: String, required: true },
    tags: [String],
    image: { type: String }, // ← Base64-Bild hier gespeichert (kann bis ~2-3 MB groß sein)
  },
  {
    timestamps: true,
  }
)

export const Post = mongoose.model('Post', postSchema) // Großes 'P' ist besser!