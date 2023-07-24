const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./user-seeds.json');
const postData = require('./post-seeds.json');
const commentData = require('./comment-seeds.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
        plain: true
    })

    const posts = await Post.bulkCreate(postData, {
        individualHooks: true,
        returning: true,
        plain: true
    })


    const comments = await Comment.bulkCreate(commentData, {
        returning: true,
        plain: true
    })
    process.exit(0);
};

seedDatabase();