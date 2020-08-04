//https://stackoverflow.com/questions/53519541/node-js-slack-api-integration-error-an-api-error-occurred-channel-not-foun
const { WebClient } = require('@slack/web-api');

module.exports = (slackToken, slackChannel) => {
    const web = new WebClient(slackToken);
    return module.exports = async(pullRequests) => {
            let pullRequestData = '';
            let pullRequestsRepositoryName = '';
            pullRequests.forEach((pullRequest) => {
                if (!pullRequest.isDraft) {
                    pullRequestsRepositoryName = pullRequest.repositoryName;
                    pullRequestData += `<${pullRequest.url}|${pullRequest.title}> (${pullRequest.whoOpened})\n\tAbertura do PR: ${pullRequest.createDate}\n\tAssignees: ${pullRequest.reviewers}\n\n\n`
                }
            });
            
            const text = {
                "channel": slackChannel,
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

            await web.chat.postMessage(text);
        }
}