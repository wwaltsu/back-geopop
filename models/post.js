const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const postSchema = new mongoose.Schema({
    label: "String",
    marker: "String",
    gif: "String",
    pos: [ "number", "number"],
    sender_id: "number",
    createdAt: {
      type: Date,
      default: Date.now(),
    }
  })

  postSchema.index( { "createdAt": 1 }, { expireAfterSeconds: 3600} )
  

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})




module.exports = mongoose.model('Post', postSchema)
