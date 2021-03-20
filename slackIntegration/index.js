const fetch = require('node-fetch');

module.exports = (slackWebHook) => {
    return module.exports = async (text) => {
            await fetch(slackWebHook, {
                method: 'POST',
                body: JSON.stringify(text),
                headers: { 'Content-Type': 'application/json' }
            })
            .catch(err => console.log(err));
        }
}