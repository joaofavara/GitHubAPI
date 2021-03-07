const credentials = require('dotenv').config().parsed;

module.exports = {
    timer: credentials.TIMER,
    repositories: credentials.REPOSITORIES,
    owner: credentials.OWNER,
    auth: credentials.AUTH_GITHUB,
    slackWebHook: credentials.SLACK_WEB_HOOK,
}