module.exports = (date = null) => {
    const formattedDate = date ? new Date(date) : new Date();
    return `${formattedDate.getFullYear()}.${formattedDate.getMonth() + 1}.${formattedDate.getDate()}`;
};