const express = require('express');
const router = express.Router();
const messageHandlers = require('../controllers/messageHandlers');

router.get('/', (req, res) => {
  res.send("this is a homepage. that is all");
});

router.get('/sendmsg', messageHandlers.sendmsg);

router.post('/sms', messageHandlers.receivemsg);

router.get('/song/:song', (req, res) => {
  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile('/app/res/audios/' + req.params.song)
})router.get('/xml', (req, res) => {
  res.sendFile('/app/music.xml')

})module.exports = router;
