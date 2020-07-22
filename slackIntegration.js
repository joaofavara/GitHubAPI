const { WebClient } = require('@slack/web-api');

function formatDate(date) {
    const formatedDate = new Date(date);
    return `${formatedDate.getDate()}/${formatedDate.getMonth() + 1}/${formatedDate.getFullYear()}`;
}

module.exports = (slackToken, slackChannel) => {
    return module.exports = async(pullRequest) => {
            let prInformation = '';
            let prRepo = '';
            pullRequest.data.forEach((pr) => {
                if (pr.assignees.length < 2) {
                    const assignee = pr.assignees.length > 0 ? pr.assignees.map((assignee) => assignee.login) : 'Nenhum';
                    prRepo = pr.head.repo.name;
                    prInformation = prInformation + `<${pr.html_url}|${pr.title}>\n\tAbertura do PR: ${formatDate(pr.created_at)}\n\tAssignees: ${assignee}\n\n\n`
                }
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
        
            const web = new WebClient(slackToken);
            await web.chat.postMessage(text);
        }
}