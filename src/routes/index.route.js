const express = require('express');
const router = express.Router();
const {getAvailableDate} = require('../controller/index.controller');

router.route('/available/:date')
    .get(getAvailableDate)

module.exports = router;