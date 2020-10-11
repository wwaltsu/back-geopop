const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI


const replySchema = new mongoose.Schema({
 
    title: {
      required: true,
      minlength: 1,
      type: String

    },
    alias: {
      required: true,
      minlength: 1,
      type: String

    },
    text: {
      required: true,
      minlength: 1,
      type: String

    },
    marker: {
      type: String,
      required: true,
      minlength: 3
    },
    pos: [ "number", "number"],
    receiver_id: "number",
    sender_id: "number",
    createdAt: {
      type: Date,
      default: Date.now(),
    }
  })

  replySchema.index( { "createdAt": 1 }, { expireAfterSeconds: 3600} )
    
  replySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
  })

  module.exports = mongoose.model('Reply', replySchema)