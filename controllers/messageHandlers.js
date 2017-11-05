require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_AUTH;
const search = require('youtube-search');

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


exports.sendmsg = (req, res) => {
    let body = req.query.body;
    let number = parseInt(req.query.number);
    if (!(req.query.number) || req.query.number.length < 10) {
        res.send({
            error: true,
            errormsg: "Number is not correct length, not sent, or you included 1 at the beginning, which we do not like."
        })
    } 
    // else {
    //     res.send({
    //         error: false,
    //         body,
    //         number
    //     })
    // }

    client.messages
        .create({
            to: `+1${req.query.number}`,
            from: '+14086769926',
            body: body,
        })
        .then((message) => res.send(`Sent message with id ${message.sid}`));
}

exports.receivemsg = (req, res) => {
    console.log("Message received!");
    const twiml = new MessagingResponse();
    console.log(JSON.stringify(req.body))
    // twiml.message(`You sent: ${req.body.Body}`);
    // res.writeHead(200, {'Content-Type': 'text/xml'});
    // res.end(twiml.toString());
    var opts = {
        maxResults: 10,
        key: 'AIzaSyALc4i5Kng8dxGwU9JKCNu7PKIjXwXw6ZQ'
    };
        
    search(req.body.Body, opts, function(err, results) {
        if(err) return console.log(err);
        
        console.log(results);
    });
}

