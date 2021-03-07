module.exports = (date) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}/${formattedDate.getMonth() + 1}/${formattedDate.getFullYear()}`;
};