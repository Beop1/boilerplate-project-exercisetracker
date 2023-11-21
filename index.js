require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const crypto = require('crypto');

// const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://bernardovpp:fQySC85zha5DVbPa@cluster0.e2avfpq.mongodb.net/?retryWrites=true&w=majority', 
//                 {useNewUrlParser: true, useUnifiedTopology:  true});
// var usernameSchema = new mongoose.Schema({
//   username: String,
//   _id: String
// });

// var User = mongoose.model('username', usernameSchema);


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  let username = {
    username: req.body.username,
    _id: crypto.createHash('sha256').update(username).digest('hex')
  };
  // const hash = crypto.createHash('sha256');
  // hash.update(username);
  
  // const _id = hash.digest('hex');

  res.json({username});
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
