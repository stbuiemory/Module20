const { Post, User, Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// get all comments
router.get('/', async (req, res) => {
    try{
        const commentData = await Comment.findAll({
            include: {
                model: User,
                attributes: ['username']
            }
        })
        res.status(200).json(commentData)
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// create new comment
router.post('/', withAuth, async (req, res) => {
    try{
        const newComment = await Comment.create({
            comment_body: req.body.comment_body,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        res.status(200).json(newComment)
    }
    catch(err) {
            console.log(err);
            res.status(400).json(err);
        }
});

// update comment
router.put('/:id', withAuth, async (req, res) => {
    const thisComment = await Comment.findOne({
        where: {
            id: req.params.id
        }
    });
    if (req.session.user_id === thisComment.user_id) {
        try {
            const updateComment = await Comment.update({
                comment_body: req.body.comment_body,
            },
            {
                where: {
                    id: req.params.id
                },
            })
            if (!updateComment) {
                res.status(404).json({ message: 'Cannot find comment with this id!'})
            }
            res.status.json(updateComment)
        }
        catch (err) {
            res.status(400).json(err)
        }
    }
});

// delete comment 
router.delete('/:id', withAuth, async (req, res) => {
    const thisComment = await Comment.findOne({
        where: {
            id: req.params.id
        }
    });
    console.log(thisComment)
    console.log(thisComment.user_id)
    console.log(req.session.user_id)

    if (req.session.user_id === thisComment.user_id) {
        try {
            const oneComment = await Comment.destroy({
                where: {
                    id: req.params.id
                }
            })
            if (!oneComment) {
                res.status(404).json({ message: 'No comment found with this id!'})
            }
            res.status(200).json(oneComment)
        }
        catch (err) {
        console.log(err);
        res.status(500).json(err);
        }
    }
    else {
        res.status(400).json({ message: "You cannot delete a comment written by another user!"})
    }
});

module.exports = router;