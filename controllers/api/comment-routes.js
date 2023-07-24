const { Post, User, Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET all comments
router.get('/', async (req, res) => {
    try {
        // Retrieve all comments, including the username of the comment author
        const commentData = await Comment.findAll({
            include: {
                model: User,
                attributes: ['username']
            }
        });
        res.status(200).json(commentData);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// POST a new comment
router.post('/', withAuth, async (req, res) => {
    try {
        // Create a new comment associated with the user
        const newComment = await Comment.create({
            comment_body: req.body.comment_body,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        });
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// UPDATE a comment
router.put('/:id', withAuth, async (req, res) => {
    try {
        // Find the comment by id
        const thisComment = await Comment.findOne({
            where: {
                id: req.params.id
            }
        });
        // Check if the user owns the comment before updating
        if (req.session.user_id === thisComment.user_id) {
            const updatedComment = await Comment.update({
                comment_body: req.body.comment_body,
            }, {
                where: {
                    id: req.params.id
                },
            });
            if (updatedComment[0] === 0) {
                // If no rows were affected, the comment with the provided id doesn't exist
                res.status(404).json({ message: 'Comment not found' });
            } else {
                res.status(200).json(updatedComment);
            }
        } else {
            res.status(403).json({ message: 'You are not authorized to update this comment' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE a comment 
router.delete('/:id', withAuth, async (req, res) => {
    try {
        // Find the comment by id
        const thisComment = await Comment.findOne({
            where: {
                id: req.params.id
            }
        });
        // Check if the user owns the comment before deleting
        if (req.session.user_id === thisComment.user_id) {
            const deletedComment = await Comment.destroy({
                where: {
                    id: req.params.id
                }
            });
            if (deletedComment === 0) {
                // If no rows were affected, the comment with the provided id doesn't exist
                res.status(404).json({ message: 'Comment not found' });
            } else {
                res.status(200).json(deletedComment);
            }
        } else {
            res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;