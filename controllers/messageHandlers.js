require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');
const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_AUTH;
const search = require('youtube-search'); // require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const helpers = require('../helpers');
const {YTSearcher} = require('ytsearcher');
const searcher = new YTSearcher('AIzaSyALc4i5Kng8dxGwU9JKCNu7PKIjXwXw6ZQ')
const fs = require('fs');
const ytdl = require('ytdl-core');
const uuidv4 = require('uuid/v4');
const path = require('path');
const converter = require('video-converter')
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const {spawn} = require('child_process')

exports.sendmsg = (req, res) => {
  let body = req.query.body;
  let number = parseInt(req.query.number);
  if (!(req.query.number) || req.query.number.length < 10) {
    res.send({error: true, errormsg: "Number is not correct length, not sent, or you included 1 at the beginning, which we do not like."})
  }
  // else {
  // res.send({
  // error: false,
  // body,
  // number
  // })
  // }
  client.messages.create({to: `+1${req.query.number}`, from: '+14086769926', body: body}).then((message) => res.send(`Sent message with id ${message.sid}`));
}

exports.receivemsg = async(req, res) => {
  console.log("Message received!");
  console.log(req.body.Body)
  const twiml = new MessagingResponse();
  const searchTerm = req.body.Body;
  let result = await searcher.search(searchTerm, {type: 'video'});
  let videoLink = result.first.url;
  let videoName = uuidv4();
  let fileName = '/app/res/video/' + videoName + '.mp4';
  const audioOutput = '/app/res/audio/' + videoName + '.mp3';
  const mainOutput = '/app/res/audio/' + uuidv4() + '.mp3';
  console.log(videoName)
  ytdl(videoLink, {
    filter: format => {
      return format.container === 'mp4' && !format.encoding;
    },
    itag: '18'
  }).pipe(fs.createWriteStream(audioOutput)).on('finish', () => {
    client.calls.create({
      url: 'http://urlecho.appspot.com/echo?status=200&Content-Type=Application%2Fxml&body=%3CResponse%3E%0A%3CSay%20voice%3D%22alice%22%3EThanks%20for%20trying%20our%20documentation.%20Enjoy!%3C%2FSay%3E%0A%3CPlay%3Ehttp%3A%2F%2Fmusicmms.herokuapp.com%2' + videoName.replace('-', '%2D') + 'c.mp%3C%2FPlay%3E%0A%3C%2FResponse%3E',
      to: '+16692479616',
      from: '+14086769926'
    }).then((call) => process.stdout.write(call.sid));

  });
};
