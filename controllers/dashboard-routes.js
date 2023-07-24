const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');

// GET all posts for the logged-in user and render the dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        // Find all posts created by the user
        const allUserPosts = await Post.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id', 'title', 'post_body', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        
        // Map the posts to plain objects
        const posts = allUserPosts.map(post => post.get({ plain: true }));
        const postlength = posts.length;
        console.log(req.session.username);
        
        // Render the dashboard view with posts and user information
        res.render('dashboard', {
            posts,
            postlength,
            username: req.session.username,
            loggedIn: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user posts.' });
    }
});