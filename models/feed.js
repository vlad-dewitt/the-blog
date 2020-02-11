const { Schema, model } = require('mongoose');



let schema = new Schema({
  date_created: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  comments: {
    type: Array
  }
});



module.exports = model('posts', schema);
