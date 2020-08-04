const schedule = require('node-schedule');
const {
    timer,
    repositories,
    onwer,
    auth,
    slackToken,
    slackChannel
} = require('./config');
const slack = require('./slackIntegration')(slackToken, slackChannel);
const gitNotification = require('./apiGitHub')(slack, onwer, auth, repositories);

schedule.scheduleJob(timer, function(){
    const date = new Date()
    console.log(`The answer to life, the universe, and everything! - ${date}`);
    gitNotification();
});