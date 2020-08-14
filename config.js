const credentions = require('dotenv').config().parsed;

module.exports = {
    timer: credentions.TIMER,
    repositories: credentions.REPOSITORIES,
    onwer: credentions.OWNER,
    auth: credentions.AUTH_GITHUB,
    slackWebHook: credentions.SLACK_WEB_HOOK,
}