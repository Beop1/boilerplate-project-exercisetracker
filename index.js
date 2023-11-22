require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const crypto = require('crypto');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bernardovpp:fQySC85zha5DVbPa@cluster0.e2avfpq.mongodb.net/?retryWrites=true&w=majority');

var usernameSchema = new mongoose.Schema({
  username: String
});

var User = mongoose.model('username', usernameSchema);


app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  var user = new User({ username: req.body.username});

  user.save();

  res.json({ username: user.username, _id: user._id });
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
