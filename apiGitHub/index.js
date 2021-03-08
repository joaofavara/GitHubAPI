const { Octokit } = require("@octokit/rest");
const { filterPullRequestInformation } = require('./utils');
const slackPullRequestMessage = require('../slackIntegration/templates/slackPullRequestMessage');

module.exports = (slackSender, owner, auth, repositories) => {
    const octokit = new Octokit({
        auth,
        baseUrl: 'https://api.github.com',
    });

    return (async () => {
            try {
                const repos = repositories.split(',');
                for(repo of repos) {
                    const pullRequests = await octokit.pulls.list({
                        owner,
                        repo,
                    });

                    if(pullRequests.data.length > 0) {
                        const review = await pullRequests.data
                            .filter(pullRequest => !pullRequest.draft)
                            .reduce(async (_acc, pullRequest) => {
                                try {
                                    const reviewers = await octokit.pulls.listReviews({
                                        owner,
                                        repo,
                                        pull_number: pullRequest.number
                                    });

                                    const data = filterPullRequestInformation(pullRequest, reviewers.data);
                                    const acc = await _acc;
                                    await acc.push(data);
                                    return acc;
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }, []);

                        Promise.all(review)
                            .then(async (data) => {
                                const messages = slackPullRequestMessage(data);
                                await slackSender(messages);
                            })
                    }
                };
            } catch (error) {
                console.log(error);
            }
        });
}
