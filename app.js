const schedule = require('node-schedule');
const {
    timer,
    repositories,
    owner,
    auth,
    slackWebHook
} = require('./config');
const slack = require('./slackIntegration')(slackWebHook);
const gitNotification = require('./apiGitHub')(slack, owner, auth, repositories);

schedule.scheduleJob(timer, function(){
    const date = new Date()
    console.log(`Running time: ${date}`);
    gitNotification();
});