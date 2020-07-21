const { Octokit } = require("@octokit/rest");

function filterPullRequest(pullRequest) {
    const teste = pullRequest.map((pr) => {
        return {
            url: pr.url,
            created: pr.created_at,
            // assignees: pr.assignees !== '' ? pr.assignees.map((assignee) => assignee.login) : '',
            repositorio: pr.head.repo.name
        }
    })

    return teste;
}


async function getPullsRequest() {
    try {
        const repos = [
            "LearningRepository",
            "LearningVueJS"
        ];

        const octokit = new Octokit({
            auth: "",
            baseUrl: 'https://api.github.com',
        });

        const result = [];
        repos.forEach(async (result, repo) => {
            const pullRequest = await octokit.pulls.list({
                owner: "joaofavara",
                repo,
            })
            // console.log(`${repo} = ${JSON.stringify(pullRequest)}`)
            result.push(filterPullRequest(pullRequest.data));
            // return pullRequest.data;
        })
        return result;

        // for(let i = 0; i < repos.length; i++) {
        //     const pullRequest = await octokit.pulls.list({
        //         owner: "joaofavara",
        //         repo: repos[i],
        //     })
        //     // console.log(`${repo} = ${JSON.stringify(pullRequest)}`)
        //     return filterPullRequest(pullRequest.data);
        //     // return pullRequest.data;
        // }

        // return pullRequest.data[0];
    } catch (err) {
        console.log(err);
    }
}  


module.exports = (async (req, res) => {
    try {
        const result = await getPullsRequest();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})
