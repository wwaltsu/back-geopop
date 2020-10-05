const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const Post = require('./models/post')
const Reply = require('./models/reply')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.get('/api/replies', (request, response) => {
  Reply.find({}).then(replies => {
    response.json(replies.map(reply => reply.toJSON()))
  })
})

app.get('/api/replies/:id', (request, response, next) => {
  //console.log("id ",request.params.id);
  Reply.find({"receiver_id" :  request.params.id})
    .then(reply => {
      if (reply) {
        response.json(reply)  
      } else {
        response.status(404).end()
      }
     //console.log("reply ",reply);
    })
    .catch(error => next(error))
})

app.post('/api/replies', (request, response, next) => {
  const body = request.body
  console.log(body)
  const reply = new Reply({
    alias: body.alias,
    text: body.text,
    pos: body.pos,
    title: body.title,
    marker: body.marker,
    receiver_id: body.receiver_id,
    sender_id: body.sender_id, 
  })

  reply.save()
  .then(savedReply => savedReply.toJSON())
  .then(savedAndFormattedReply => {
    response.json(savedAndFormattedReply)
  }) 
  .catch(error => next(error))
})
app.put('/api/replies/:id', (request, response, next) => {
  const body = request.body
  const reply = {
    alias: body.alias,
    pos: body.pos,
    title: body.title,
    sender_id: body.sender_id,
    receiver_id: body.receiver_id,
    marker: body.marker,
    text: body.text,
  }
})

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
      text: body.text,
      sender_id: body.sender_id,
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
    text: body.text,
    sender_id: body.sender_id,
  }

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