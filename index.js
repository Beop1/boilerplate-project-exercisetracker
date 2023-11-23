require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
let bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bernardovpp:fQySC85zha5DVbPa@cluster0.e2avfpq.mongodb.net/?retryWrites=true&w=majority');

var userSchema = new mongoose.Schema({
  username: String,
  date: String,
  duration: Number,
  description: String
});

var User = mongoose.model('user', userSchema);

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

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    let date = req.body.date !== "" ? new Date(req.body.date) : new Date();
    // let user = await User.findOne({_id: req.params._id});

    user = User.updateOne({_id: req.params._id}, {description: req.body.description}, {duration: req.body.duration}, {date: date }, {new:true});
    user.save();

    console.log(user);
    res.json(user);
    // res.json({ _id: req.params._id, username: user.username, date: date.toDateString(), duration: exercise.duration, description: exercise.description });
  }
  catch (err) {
    res.json(err);
  };
});

app.get('/api/users/:_id/logs', (req, res) => {


});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
