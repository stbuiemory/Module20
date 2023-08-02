const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            // Hostname of database; comment out if using localhost
            host: 'jtb9ia3h1pgevwb1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            // Hostname of localhost; comment out if using Heroku
            // host: 'localhost', 
            dialect: 'mysql',
            port: process.env.PORT || 3306
        }
    );
}

module.exports = sequelize;