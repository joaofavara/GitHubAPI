const credentions = require('dotenv').config().parsed;

module.exports = {
    timer: credentions.TIMER,
    repositories: credentions.REPOSITORIES,
    onwer: credentions.OWNER,
    auth: credentions.AUTH_GITHUB,
    slackToken: credentions.SLACK_TOKEN,
    slackChannel: credentions.SLACK_CHANNEL,
}