const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI


const replySchema = new mongoose.Schema({
 
    title: "String",
    alias: "String",
    text: "String",
    pos: [ "number", "number"],
    marker: "String",
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