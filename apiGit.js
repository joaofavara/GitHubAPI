const { Octokit } = require("@octokit/rest");

function getReviewers(assignees, reviewes) {
    const pullRequestAssignees = assignees.map(assignee => assignee.login);

    if (reviewes.length === 0) {
        return pullRequestAssignees.map(reviewer => {
            return `${reviewer} - REVIEWING`
        });
    }

    return pullRequestAssignees.map(reviewer => {
        const lastAction = reviewes.filter(r => r.user.login === reviewer);
        return `${reviewer} - ${lastAction[lastAction.length - 1].state}`
    });
};

function formatDate(date) {
    const formatedDate = new Date(date);
    return `${formatedDate.getDate()}/${formatedDate.getMonth() + 1}/${formatedDate.getFullYear()}`;
}

function filterPullRequestInformation(pullRequest, reviewes) {
    return {
        url: pullRequest.html_url,
        title: pullRequest.title,
        whoOpened: pullRequest.user.login,
        createDate: formatDate(pullRequest.created_at),
        repositoryName: pullRequest.head.repo.name,
        reviewers: getReviewers(pullRequest.assignees, reviewes)
    }
}

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
