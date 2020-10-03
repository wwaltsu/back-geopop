const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const Post = require('./models/post')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.get('/api/posts', (request, response) => {
  Post.find({}).then(posts => {
    response.json(posts.map(post => post.toJSON()))
  })
})

app.post('/api/posts', (request, response, next) => {
  const body = request.body
  console.log(body)
  const post = new Post({
    gif: body.gif,
    label: body.label || false,
    marker: body.marker,
    pos: body.pos,
  })

  post.save()
    .then(savedPost => savedPost.toJSON())
    .then(savedAndFormattedPost => {
      response.json(savedAndFormattedPost)
    }) 
    .catch(error => next(error))
})

app.get('/api/posts/:id', (request, response, next) => {
  Post.findById(request.params.id)
    .then(post => {
      if (post) {
        response.json(post.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/posts/:id', (request, response, next) => {
  const body = request.body
  const post = {
    gif: body.gif,
    label: body.label,
    marker: body.marker,
    pos: body.pos,
  }

  Post.findByIdAndUpdate(request.params.id, post, { new: true })
    .then(updatedPost => {
      response.json(updatedPost.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})