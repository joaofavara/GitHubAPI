// const credentials = require('dotenv').config().parsed;

module.exports = {
    timer: process.env.TIMER,
    repositories: process.env.REPOSITORIES,
    owner: process.env.OWNER,
    auth: process.env.AUTH_GITHUB,
    slackWebHook: process.env.SLACK_WEB_HOOK,
}