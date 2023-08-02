const { Post, User, Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET all user's posts
router.get('/', async (req, res) => {
    try {
        // Fetch all posts with their associated author (username) and comments (with comment authors)
        const allPosts = await Post.findAll({
            attributes: ['id', 'title', 'post_body', 'created_at'],
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_body', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
            ],
        });
        res.status(200).json(allPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});


// GET post by id
router.get('/:id', async (req, res) => {
    try {
        // Find a specific post by its id, including its author (username) and comments (with comment authors)
        const getOnePost = await Post.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'title', 'post_body', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_body', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
            ],
        });

        if (!getOnePost) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json(getOnePost);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch the post' });
    }
});


// POST new post
router.post('/', withAuth, async (req, res) => {
    try {
        // Create a new post associated with the user
        const newPost = await Post.create({
            title: req.body.title,
            post_body: req.body.post_body,
            user_id: req.session.user_id,
        });
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create the post' });
    }
});

// PUT post
router.put('/:id', withAuth, async (req, res) => {
    try {
        // Update a specific post by its id, making sure the user owns the post
        const updatePost = await Post.update(req.body, {
            where: { id: req.params.id, user_id: req.session.user_id },
        });

        if (updatePost[0] === 0) {
            res.status(404).json({ message: 'Post not found or you are not authorized to update it' });
        } else {
            res.status(200).json({ message: 'Post updated successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to update the post' });
    }
});

// DELETE post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        // Delete a specific post by its id, making sure the user owns the post
        const deletePost = await Post.destroy({
            where: { id: req.params.id, user_id: req.session.user_id },
        });

        if (!deletePost) {
            res.status(404).json({ message: 'Error: Post not found or you are not authorized to delete.' });
        } else {
            res.status(200).json({ message: 'Post deleted successfully.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Post failed to delete.' });
    }
});

module.exports = router;