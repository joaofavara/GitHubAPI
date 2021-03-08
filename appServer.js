const schedule = require('node-schedule');
const { Octokit } = require("@octokit/rest");

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
const slackPullRequestMTP = require('./slackIntegration/templates/slackPullRequestMTP');


schedule.scheduleJob(timer, function(){
    const date = new Date()
    console.log(`Running time: ${date}`);
    gitNotification();
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/github', (req, res, next) => {
    const result = req.body;
    const eventType = req.headers['x-github-event'] === 'pull_request';
    console.log('req.headers["X-GitHub-Event"]: ', req.headers['x-github-event']);
    console.log('req.headers: ', req.headers);
    console.log('eventType: ', eventType);

    if (eventType) {
        const data = filterPullRequestInformation(result.pull_request, []);
        console.log('data: ', data);
        slack([data]);
    }
    return res.end();
})

app.post('/refresh', (req, res) => {
    const date = new Date()
    console.log(`Running time: ${date}`);
    gitNotification();
    return res.status(200).end()
})

app.post('/mtp', async (req, res) => {
    const parameters = req.body['text'].split(' ');
    console.log('parameters: ', parameters);
    const repo = parameters[0];
    const head = parameters[1];
    const base = parameters[2];

    const octokit = new Octokit({
        auth,
        baseUrl: 'https://api.github.com',
    });

    const { data } = await octokit.pulls.create({
        owner,
        repo,
        head,
        base,
        title: 'MTP'
      });

    const message = slackPullRequestMTP(data.html_url, repo);
    await slack(message);
    return res.status(200).end()
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running in ${port}`));
