const { Post, User, Comment } = require('../models');
const router = require('express').Router();

// GET homepage 
router.get('/', async (req, res) => {
    try {
        // Fetch all posts along with their comments and authors
        const postData = await Post.findAll({
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
            ],
        });
        const posts = postData.map(post => post.get({ plain: true }));
        console.log('posts: ', posts);
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        console.log(req.session.loggedIn);
        res.redirect('/dashboard');
        return;
    }
    console.log(req.session);
    res.render('login');
});

// GET sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// GET single post by id 
router.get('/post/:id', async (req, res) => {
    console.log(req.session);
    try {
        const singlePost = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'post_body', 'title', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_body', 'user_id', 'created_at'],
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

        if (!singlePost) {
            return res.status(404).json({ message: 'No post found with this id.' });
        }
        const post = singlePost.get({ plain: true });
        console.log(post);
        res.render('single-post', { post, loggedIn: req.session.loggedIn, user: req.session.user_id });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});