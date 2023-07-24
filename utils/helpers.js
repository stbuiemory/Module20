const Handlebars = require("express-handlebars");

module.exports = {
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
        },

    isEqual: (x, y) => {
        if (x===y) {
            return true
        }
        return false
    },
}
