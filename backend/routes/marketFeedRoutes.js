const express = require('express');
const router = express.Router();
const marketFeed = require('../controllers/marketFeedController');

router.get('/stream', marketFeed.stream); // public read-only SSE

module.exports = router;