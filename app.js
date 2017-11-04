const express = require('express');
const app = express();
const routes = require('./routes/index');

app.use('/', routes);

app.listen(process.env.PORT || 1337, (err) => {
    if(err) console.log(err)
    else console.log("Listening on port 1337")
})