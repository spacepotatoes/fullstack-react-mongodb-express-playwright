// src/__tests__/posts.test.js  (oder wo du sie hast)

import mongoose from "mongoose";
import { describe, expect, test, beforeEach } from '@jest/globals';   // ← Korrektur: '@jest/globals'
import { createPost, listAllPosts, listAllPostsByAuthor, listAllPostsByTag, getPostById, updatePost, deletePost } from '../services/posts.js';        // ← zwei Punkte + Slash
import { Post } from '../db/models/post.js';

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      author: 'Giuseppe Troiano',
      contents: 'This post is stored in a MongoDB database using Mongoose',
      tags: ['mongoose', 'mongodb']
    };

    const createdPost = await createPost(post);

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId); // ← ObjectIdId → ObjectId
    const foundPost = await Post.findById(createdPost._id);

    // foundPost.Post → foundPost (Post ist das Dokument selbst)
    expect(foundPost).toMatchObject(post);
    expect(foundPost.createdAt).toBeInstanceOf(Date);
    expect(foundPost.updatedAt).toBeInstanceOf(Date);
  });

  test('without title should fail', async () => {
    const post = {
      author: 'Giuseppe Troiano',
      contents: 'Post with no title',
      tags: ['empty']
    };

    await expect(createPost(post)).rejects.toThrow(mongoose.Error.ValidationError);
    // oder falls du die genaue Nachricht prüfen willst:
    // await expect(createPost(post)).rejects.toThrow(/title.*required/i);
  });

  test('with minimal parameters should succeed', async () => {
    const createdPost = await createPost({ title: 'Only a title' });
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});

const samplePosts = [ { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux']},
{ title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react']}, { title: 'Full-Stack React Projects', author: 'Daniel Bugl',
    tags: ['react', 'node.js']
}, { title: 'Guide to TypeScript'}, 
]
let createdSamplePosts = []
beforeEach(async () => {
    await Post.deleteMany({})
    createdSamplePosts = []
    for (const post of samplePosts) {
        const createdPost = new Post(post)
        createdSamplePosts.push(await createdPost.save())
    }
})
describe('listing posts', () => {
    test('should return all posts', async () => {
        const posts = await listAllPosts() 
        expect (posts.length).toEqual(createdSamplePosts.length)
    })
})
test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort (
        (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) =>  post.createdAt)).toEqual(sortedSamplePosts.map((post) => post.createdAt),
)
})
test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
        sortBy: 'updatedAt',
        sortOrder: 'ascending'
    })
    const sortedSamplePosts = createdSamplePosts.sort(
        (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
        sortedSamplePosts.map((post) => post.updatedAt),
    )
})
test('should be able fto filter posts by author', async () => {
    const posts = await listAllPostsByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
})
test('should be able fto filter posts by tags', async () => {
    const posts = await listAllPostsByTag('node.js')
    expect(posts.length).toBe(1)
})
describe('getting a post', () => {
test('should return the full post', async () => {
const post = await getPostById(createdSamplePosts[0]._id)
expect(post.toObject()).toEqual(createdSamplePosts[0].
toObject())
})
test('should fail if the id does not exist', async () => {
const post = await getPostById('000000000000000000000000')
expect(post).toEqual(null)
})
})

describe('updating posts', () => {
test('should update the specified property', async () => {
await updatePost(createdSamplePosts[0]._id, {
author: 'Test Author',
})
const updatedPost = await Post.
findById(createdSamplePosts[0]._id)
expect(updatedPost.author).toEqual('Test Author')
})
test('should not update other properties', async () => {
await updatePost(createdSamplePosts[0]._id, {
author: 'Test Author',
})
const updatedPost = await Post.
findById(createdSamplePosts[0]._id)
expect(updatedPost.title).toEqual('Learning Redux')
})
test('should update the updatedAt timestamp', async () => {
await updatePost(createdSamplePosts[0]._id, {
author: 'Test Author',
})
const updatedPost = await Post.
findById(createdSamplePosts[0]._id)
expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
createdSamplePosts[0].updatedAt.getTime(),
)
})
test('should fail if the id does not exist', async () => {
const post = await updatePost('000000000000000000000000', {
author: 'Test Author',
})
expect(post).toEqual(null)
})
})

describe('deleting posts', () => {
test('should remove the post from the database', async () => {
const result = await deletePost(createdSamplePosts[0]._id)
expect(result.deletedCount).toEqual(1)
const deletedPost = await Post.
findById(createdSamplePosts[0]._id)
expect(deletedPost).toEqual(null)
})
test('should fail if the id does not exist', async () => {
const result = await deletePost('000000000000000000000000')
expect(result.deletedCount).toEqual(0)
})
})