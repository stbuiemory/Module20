const { Post, User, Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// get all user's posts
router.get('/', async (req, res) => {
    try {
        const allPosts = await Post.findAll({
            attributes: [
                'id',
                'title',
                'post_body',
                'created_at'
            ],
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_body',
                        'user_id'
                    ],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        res.status(200).json(allPosts)
    } 
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

// get post by id
router.get('/:id', async (req, res) => {
    try{
        const getOnePost = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'post_body',
                'title',
                'created_at'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_body', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        if (!getOnePost) {
            res.status(404).json({ message: 'No post found with this id!' });
        }
        res.status(200).json(getOnePost)
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create new post 
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            post_body: req.body.post_body,
            user_id: req.session.user_id
        },
        {
            individualHooks: true
        });
        res.status(200).json(newPost)
    }
    catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// update post
router.put('/:id', withAuth, async (req, res) => {
    console.log(req.body, req.params.id)
    try{
        const updatePost = await Post.update(req.body, {
            where: {
                id: req.params.id
            },
            individualHooks: true
        })
        if (!updatePost) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        } 
        res.status(200).json(updatePost);
    }
    catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// delete post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletePost = await Post.destroy({
        where: {
            id: req.params.id
        }
    })
    if (!deletePost) {
        res.status(404).json({ message: "Cannot delete a post that doesn't exist!" })
        return;
        }
        res.status(200).json(deletePost);
    }
    catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;