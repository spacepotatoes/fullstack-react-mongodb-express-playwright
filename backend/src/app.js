// backend/src/app.js
import express from 'express'
import { postsRoutes } from './routes/posts.js'
import cors from 'cors'

const app = express()

// CORS zuerst
app.use(cors())

// WICHTIG: NUR express.json() mit hohem Limit – body-parser komplett weg!
app.use(express.json({ limit: '15mb' }))           // 15 MB reicht locker für Base64-Bilder
app.use(express.urlencoded({ limit: '15mb', extended: true }))

// Deine Routes
postsRoutes(app)

// Test-Route
app.get('/', (req, res) => {
  res.send('Server läuft – Bild-Upload bis 15 MB möglich!')
})

export { app }