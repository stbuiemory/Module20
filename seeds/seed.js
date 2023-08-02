const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./user-seeds.json');
const postData = require('./post-seeds.json');
const commentData = require('./comment-seeds.json');

// Define a function to seed the database
const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // Seed the 'User' table with data from the 'user-seeds.json' file
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
        plain: true
    })

    // Seed the 'Post' table with data from the 'post-seeds.json' file
    const posts = await Post.bulkCreate(postData, {
        individualHooks: true,
        returning: true,
        plain: true
    })

    // Seed the 'Comment' table with data from the 'comment-seeds.json' file
    const comments = await Comment.bulkCreate(commentData, {
        returning: true,
        plain: true
    })
    process.exit(0);
};

seedDatabase();