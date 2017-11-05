require('dotenv').config();

const ffmpeg = require('ffmpeg');
const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_AUTH;
const search = require('youtube-search');

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const helpers = require('../helpers');

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

exports.receivemsg = (req, res) {
    console.log("Message received!");
    const twiml = new MessagingResponse();
    const opts = {
        maxResults: 10,
        key: 'AIzaSyALc4i5Kng8dxGwU9JKCNu7PKIjXwXw6ZQ'
    };
        
    const results = search(req.body.Body, opts, (err, results) => {
        if(err) return console.log(err);
        return results;
    });
    helpers.downloadVideo(results[0].link)
    .then(() => {
        try {
            const process = new ffmpeg('/res/video/' + results[0].title)
            process.then(function (video) {
                video.fnExtractSoundToMP3('/res/audio/' + results[0].title + '.mp3', function (error, file) {
                    if (!error) console.log('Audio file: ' + file);
                });
            }, function (err) {
                console.log('Error: ' + err);
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
        fs.unlink('../res/video/' + results[0].link)
        console.log(req.body.Body)
    })
}

