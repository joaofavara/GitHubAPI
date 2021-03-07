const schedule = require('node-schedule');
const {
    timer,
    repositories,
    owner,
    auth,
    slackWebHook
} = require('./config');
const slack = require('./slackIntegration')(slackWebHook);
const { filterPullRequestInformation } = require('./apiGitHub/utils');
const gitNotification = require('./apiGitHub')(slack, owner, auth, repositories);
const express = require('express');

schedule.scheduleJob(timer, function(){
    const date = new Date()
    console.log(`Running time: ${date}`);
    gitNotification();
});

const app = express();

app.use(express.json());

app.post('/github', (req, res, next) => {
    const result = req.body;
    const eventType = req.header['X-GitHub-Event'] === 'pull_request';

    if (eventType) {
        const data = filterPullRequestInformation(result.pull_request, []);
        slack(data);
    }
    return res.end();
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running in ${port}`));
