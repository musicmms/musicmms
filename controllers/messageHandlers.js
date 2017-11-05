require('dotenv').config();
const ffmpeg = require('ffmpeg');
const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_AUTH;
const search = require('youtube-search'); // require the Twilio module and create a REST client 
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const helpers = require('../helpers');
const { YTSearcher } = require('ytsearcher');
const searcher = new YTSearcher('AIzaSyALc4i5Kng8dxGwU9JKCNu7PKIjXwXw6ZQ')
const fs = require('fs');
const ytdl = require('ytdl-core');
const uuidv4 = require('uuid/v4');
const path = require('path');

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
    // res.send({
    // error: false,
    // body,
    // number
    // })
    // }
    client.messages
        .create({
            to: `+1${req.query.number}`,
            from: '+14086769926',
            body: body,
        })
        .then((message) => res.send(`Sent message with id ${message.sid}`));
}

exports.receivemsg = async (req, res) => {
    console.log("Message received!");
    const twiml = new MessagingResponse();
    const searchTerm = req.body.Body;
    let result = await searcher.search(searchTerm, { type: 'video' });
    let videoLink = result.first.url;
    let videoName = uuidv4();
    ytdl(videoLink).pipe(fs.createWriteStream('musicmms/res/video/' + videoName + '.mp4'));
    try {
        var process = new ffmpeg('musicmms/res/video/' + videoName + '.mp4');
        process.then(function (video) {
            // Callback mode
            video.fnExtractSoundToMP3('musicmms/res/audio/' + videoName + '.mp3', function (error, file) {
                if (!error) console.log('Audio file: ' + file);
            });
        }, function (err) {
            console.log('Error: ' + err);
        }).then(function () {
            fs.unlink('musicmms/res/video/' + videoName + '.mp4')
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
}
