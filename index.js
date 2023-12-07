require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bernardovpp:fQySC85zha5DVbPa@cluster0.e2avfpq.mongodb.net/?retryWrites=true&w=majority');

var User = mongoose.model('user', { username: String });
var Exercise = mongoose.model('exercise', { user_id: { type: String, required: true }, description: String, duration: Number, date: Date });

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const userObj = new User({ username: req.body.username });

  try {
    const user = await userObj.save();
    res.json(user);
  }
  catch (err) {
    console.log(err);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find().select("_id username");
    if (!users) res.send("No users found");
    else res.json(users);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/users/:_id/exercises', async (req, res) => {

  const id = req.params._id;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.send("Could not find user");
    }
    else {
      const exerciseObj = new Exercise({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      });

      const exercise = await exerciseObj.save();

      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString()
      });
    }
  }
  catch (err) { console.log(err); }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const id = req.params._id;
  const user = await User.findById(id);

  if (!user) return res.send("Could not find user");

  let dateObj = {};

  if (from) dateObj["$gte"] = new Date(from);
  if (to) dateObj["$lte"] = new Date(to);

  let filter = {
    user_id: id
  }

  if (from || to) filter.date = dateObj;

  const exercises = Exercise.find(filter).limit(Number.parseInt(limit) ?? 500);

  const log = (await exercises).map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
