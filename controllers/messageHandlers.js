require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');
const accountSid = process.env.TWILIO_ACCOUNT;
const authToken = process.env.TWILIO_AUTH;
const search = require('youtube-search'); // require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const helpers = require('../helpers');
const {YTSearcher} = require('ytsearcher');
const searcher = new YTSearcher('API-KEY-HERE')
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

exports.receivemsgCall = async(req, res) => {
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
    }

  }).pipe(fs.createWriteStream(audioOutput)).on('finish', () => {
    var command = ffmpeg('/app/res/audio/' + videoName + '.mp3').format('mp3');
    command.save('/app/res/audio/' + videoName + 'done.mp3');
    const twiml = new VoiceResponse();
    twiml.play('http://musicmms.herokuapp.com/song/' + videoName + 'done.mp3');
    console.log('http://musicmms.herokuapp.com/song/' + videoName + '.mp3')
    console.log(twiml.toString())
    // Render the response as XML in reply to the webhook request
    console.log('http://urlecho.appspot.com/echo?status=200&Content-Type=application%2Fxml&body=' + encodeURI(twiml.toString()))
    client.messages.create({body: `You asked for ${req.body.Body}. You should recieve a phonecall with your music shortly!`, to: req.body.From, from: '+14086769926'}).then((message) => process.stdout.write(message.sid));
    client.calls.create({
      url: 'http://urlecho.appspot.com/echo?status=200&Content-Type=application%2Fxml&body=' + encodeURI(twiml.toString()),
      to: req.body.From,
      from: '+14086769926'
    }).then((call) => process.stdout.write(call.sid));
  })
};
