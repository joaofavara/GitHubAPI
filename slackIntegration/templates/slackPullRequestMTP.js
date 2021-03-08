module.exports = (mtpUrl, repository) => ({
        "blocks": [
            {
                "type": "section",
                "block_id": "section567",
                "text": {
                    "type": "mrkdwn",
                    "text": `<${mtpUrl}|MTP> successfully created for ${repository}!`,
                },
            },
            
        ]
    });
