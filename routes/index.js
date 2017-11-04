const express = require('express');
const router = express.Router();
const messageHandlers = require('../controllers/messageHandlers');

router.get('/', (req, res) => {
    res.send("this is a homepage. that is all");
});

router.get('/sendmsg', messageHandlers.sendmsg);

router.post('/receivemsg', messageHandlers.receivemsg)

module.exports = router;