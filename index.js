const express = require('express')
const app = express()
const cors = require('cors')
const crypto = require('crypto');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  let username = req.body.username;
  const hash = crypto.createHash('sha256');
  hash.update(username);
  
  const _id = hash.digest('hex');

  res.json({username: username, _id});
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
