const { Octokit } = require("@octokit/rest");


module.exports = (slack, owner, auth, repositories) => {
    return (async () => {
            try {
                const octokit = new Octokit({
                    auth,
                    baseUrl: 'https://api.github.com',
                });
        
                const repos = repositories.split(',');
                for(repo of repos) {
                    const pullRequest = await octokit.pulls.list({
                        owner,
                        repo,
                    })        
                    slack(pullRequest);
                };
            } catch (error) {
                console.log('TESTE...');
                console.log(error);
            }
        });
}
