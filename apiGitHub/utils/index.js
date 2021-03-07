const getReviewers = require('./getReviewers');
const formatDate = require('./formatDate');

module.exports = {
    filterPullRequestInformation: (pullRequest, reviewers) => {
        return {
            url: pullRequest.html_url,
            title: pullRequest.title,
            whoOpened: pullRequest.user.login,
            createDate: formatDate(pullRequest.created_at),
            repositoryName: pullRequest.head.repo.name,
            reviewers: getReviewers(pullRequest.assignees, reviewers)
        }
    }
}