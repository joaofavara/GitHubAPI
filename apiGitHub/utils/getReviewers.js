module.exports = (assignees, reviewes) => {
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