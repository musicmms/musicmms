const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('go away you should be somehwere else');
});

app.listen(1337, (err) => {
    if(err) console.log(err)
    else console.log("Listening on port 1337")
})