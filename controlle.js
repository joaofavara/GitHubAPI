const express = require('express');
const router = express.Router()
const gitHub = require('./apiGit');

router.get('/', gitHub);

module.exports = router;