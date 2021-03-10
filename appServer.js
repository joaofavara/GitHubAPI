const schedule = require('node-schedule');
const { Octokit } = require("@octokit/rest");

const {
    timer,
    repositories,
    owner,
    auth,
    slackWebHook
} = require('./config');
const slackSender = require('./slackIntegration')(slackWebHook);
const { filterPullRequestInformation } = require('./apiGitHub/utils');
const gitNotification = require('./apiGitHub')(slackSender, owner, auth, repositories);
const express = require('express');
const slackPullRequestMTP = require('./slackIntegration/templates/slackPullRequestMTP');
const slackPullRequestMessage = require('./slackIntegration/templates/slackPullRequestMessage');
const slackRefresh = require('./slackIntegration/templates/slackRefresh');
const formatDate = require('./apiGitHub/utils/formatDate');


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
    const isCreation = result.action !== 'closed';
    const eventType = req.headers['x-github-event'] === 'pull_request';

    if (eventType && isCreation) {
        const data = filterPullRequestInformation(result.pull_request, []);
        const message = slackPullRequestMessage([data])
        slackSender(message);
    }
    return res.end();
})

app.post('/refresh', (req, res) => {
    const date = new Date()
    console.log(`Running time: ${date}`);
    const message = slackRefresh();
    slackSender(message);
    gitNotification();
    return res.status(200).end()
})

app.post('/mtp', async (req, res) => {
    try {
        const parameters = req.body['text'].split(' ');
        console.log('parameters: ', parameters);
        const repo = parameters[0];
        const head = parameters[1];
        const base = parameters[2];
    
        const octokit = new Octokit({
            auth,
            baseUrl: 'https://api.github.com',
        });
    
        const body = '### Changes\n#### Add\n#### Remove\n#### Refactor\n'
        const title = `MTP v${formatDate()}`;
    
        const { data } = await octokit.pulls.create({
            owner,
            repo,
            head,
            base,
            title,
            body,
          });
    
        const message = slackPullRequestMTP(data.html_url, repo);
        await slackSender(message);
        return res.status(200).end()
    } catch (err) {
        // const message = slackPullRequestMTP(data.html_url, repo);
        // await slackSender(message);
        console.log(err.errors[0].message);
        return res.status(400).statusMessage(err.errors[0].message)
    }
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running in ${port}`));
