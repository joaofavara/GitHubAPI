module.exports = (pullRequests) => {
    let pullRequestData = '';
    let pullRequestsRepositoryName = '';

    pullRequests.forEach((pullRequest) => {
        if (!pullRequest.isDraft) {
            pullRequestsRepositoryName = pullRequest.repositoryName;
            pullRequestData += `<${pullRequest.url}|${pullRequest.title}> (${pullRequest.whoOpened})\n\tAbertura do PR: ${pullRequest.createDate}\n\tAssignees: ${pullRequest.reviewers}\n\n\n`
        }
    });
    
    const text = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Repositorio ${pullRequestsRepositoryName} esta com Pull Requests abertos:*`
                }
            },
            {
                "type": "section",
                "block_id": "section567",
                "text": {
                    "type": "mrkdwn",
                    "text": `${pullRequestData}`,
                },
            },
            
        ]
    };

    return text;
}