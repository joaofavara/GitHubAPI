//https://stackoverflow.com/questions/53519541/node-js-slack-api-integration-error-an-api-error-occurred-channel-not-foun
const { WebClient } = require('@slack/web-api');

function formatDate(date) {
    const formatedDate = new Date(date);
    return `${formatedDate.getDate()}/${formatedDate.getMonth() + 1}/${formatedDate.getFullYear()}`;
}

// function formateAssignees(reviewers) {
//     return reviewers.map();
// }

module.exports = (slackToken, slackChannel) => {
    const web = new WebClient(slackToken);
    return module.exports = async(pullRequest) => {
            console.log()
            let prInformation = '';
            let prRepo = '';
            pullRequest.forEach((pr) => {
                // console.log('review: ', review);
                // if (pr.assignees.length < 2) {
                    prRepo = pr.head.repo.name;
                    prInformation = prInformation + `<${pr.html_url}|${pr.title}>\n\tAbertura do PR: ${formatDate(pr.created_at)}\n\tAssignees: ${pr.reviewes}\n\n\n`
                // }
            });
            
            const text = {
                "channel": slackChannel,
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*Repositorio ${prRepo} esta com Pull Requests abertos:*`
                        }
                    },
                    {
                        "type": "section",
                        "block_id": "section567",
                        "text": {
                            "type": "mrkdwn",
                            "text": `${prInformation}`,
                        },
                    },
                    
                ]
            };

            await web.chat.postMessage(text);
        }
}