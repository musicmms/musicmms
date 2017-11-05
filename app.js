const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

express.static(path.join(__dirname + '/res'))

require('dotenv').config();
app.use('/', routes);

app.listen(process.env.PORT || 1337, (err) => {
    if(err) console.log(err)
    else console.log("Listening on port 1337")
})