const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create the Comment model by extending the Sequelize Model class
class Comment extends Model {}

// Initialize the Comment model with its attributes and options
Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comment_body: {
            type: DataTypes.STRING,
            validate: {
                len: [3]
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment'
    }
);

module.exports = Comment;