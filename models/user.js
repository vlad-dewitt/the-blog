const { Schema, model } = require('mongoose');



const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  sessions: [{
    date_created: Date,
    token: String
  }],
  profile: {
    avatar: String,
    full_name: String
  }
});



module.exports = model('users', schema);
