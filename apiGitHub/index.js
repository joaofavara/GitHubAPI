const { Octokit } = require("@octokit/rest");
const { filterPullRequestInformation } = require('./utils');

module.exports = (slack, owner, auth, repositories) => {
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
                        .map(async (pullRequest) => {
                            const reviewes = await octokit.pulls.listReviews({
                                owner,
                                repo,
                                pull_number: pullRequest.number
                            });
                            return filterPullRequestInformation(pullRequest, reviewes.data);
                        });
    
                        Promise.all(review)
                            .then(data => {
                                slack(data);
                            })
                    }
                };
            } catch (error) {
                console.log(error);
            }
        });
}
