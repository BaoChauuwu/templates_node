const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { createServer } = require('http')
const authRouter = require('./src/routes/authRoutes')
const recordRouter = require('./src/routes/recordRoutes')

dotenv.config()

const app = express()

// Parse JSON body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authRouter)
app.use('/records', recordRouter)

app.get('/', (_req, res) => {
  res.json({ message: 'Chào mừng bạn đến với FPT Library Management API 📚🚀' })
})

// Connect to MongoDB then start server
const PORT = process.env.PORT || 8386
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pe_library'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    const httpServer = createServer(app)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  })
