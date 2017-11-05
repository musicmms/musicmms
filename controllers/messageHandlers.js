require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');
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
const converter = require('video-converter')
const { spawn } = require('child_process')


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
    console.log(req.body.Body)
    const twiml = new MessagingResponse();
    const searchTerm = req.body.Body;
    let result = await searcher.search(searchTerm, { type: 'video' });
    let videoLink = result.first.url;
    let videoName = uuidv4();
    let fileName = '/home/mocha123/Documents/musicmms/res/video/' + videoName + '.mp4';
    const audioOutput = '/home/mocha123/Documents/musicmms/res/audio/' + videoName + '.mp3';
    const mainOutput = '/home/mocha123/Documents/musicmms/res/audio/' + uuidv4() + '.mp3';
    console.log(videoName)
    ytdl(videoLink, { filter: format => {
        return format.container === 'mp4' && !format.encoding; }, itag: '18' })
        .pipe(fs.createWriteStream(audioOutput))
        .on('finish', () => {
            const fileStats = fs.statSync(audioOutput);
            if(fileStats.size > 2000000) {
                client.messages.create({
                    body: `File size too big. Please enter a song that is less than 4 minutes long or be more specific in your search to find what you want.`,
                    to: req.body.From,
                    from: '+14086769926',
                })
            }
            else {
                client.messages.create({
                    body: `You asked for ${req.body.Body}. We found this.`,
                    to: req.body.From,
                    from: '+14086769926',
                    mediaUrl: `http://94a92769.ngrok.io/song/${videoName}.mp3`,
                }).then((message) => process.stdout.write(message.sid));
            }
        });
};
