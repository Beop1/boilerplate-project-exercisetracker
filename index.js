require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
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
  var user = new User({ username: req.body.username });

  user.save();

  res.json({ username: user.username, _id: user._id });
});

app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/users/:_id?/exercises', async (req, res) => {
  try {
    var user = await User.findById({_id: req.params._id});
    res.json({user});
  } catch (err){
    res.json(err);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
