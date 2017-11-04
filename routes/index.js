const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({
        reddit: "is cool",
        tumblr: "is not cool"
    });
});

module.exports = router;