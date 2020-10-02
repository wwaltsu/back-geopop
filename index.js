const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())


app.use(express.json())

let postaukset = [
  {
    "id": 1,
    "gif": "nuXIEASt1wqI",
    "label": "goth",
    "marker": "sad",
    "pos": [
      60.16985569999999,
      24.938379
    ]
  }
]


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/postaukset', (request, response) => {
  response.json(postaukset)
})

const generateId = () => {
  const maxId = postaukset.length > 0
    ? Math.max(...postaukset.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/postaukset', (request, response) => {
  const body = request.body

    const postaus = {
    label: body.label,
    marker: body.marker,
    gif: body.gif,
    pos: body.pos,
    id: generateId(),
  }

  postaukset = postaukset.concat(postaus)

  response.json(postaukset)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})