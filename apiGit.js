const { Octokit } = require("@octokit/rest");
const fs = require('fs');

function getReviewers(pr, reviewes) {
    
    if (reviewes.length === 0) {
        return [];
    }

    const pullRequestAssignees = pr.assignees.map(assignee => console.log('assignee.login: ', assignee.login) || assignee.login);
    // console.log('pullRequestAssignees: ', pullRequestAssignees);
    return pullRequestAssignees.map(reviewer => {
        const lastAction = reviewes.filter(r => r.user.login === reviewer);
        return `${reviewer} - ${lastAction[0].state}\n\t`
    });
};

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

                    const review = await pullRequests.data.map(async (pullRequest) => {
                        const reviewes = await octokit.pulls.listReviews({
                            owner,
                            repo,
                            pull_number: pullRequest.number
                        });
                        return { ...pullRequest, reviewes: getReviewers(pullRequest, reviewes.data) };
                    });

                    Promise.all(review)
                        .then(data => {
                            fs.writeFile('./aux.json', JSON.stringify(data), (err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log('OLA!');
                                }
                            });
                            console.log('EXIT ... ');
                            slack(data);
                         })
                };
            } catch (error) {
                console.log(error);
            }
        });
}
