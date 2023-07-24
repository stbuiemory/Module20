const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');

// get all posts for logged in user
router.get('/', withAuth, async (req, res) => {
    try{
        const allUserPosts = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'post_body',
                'created_at'
            ],
            include: [{
                model: Comment,
                attributes: [
                    'id',
                    'comment_body',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes:['username']
            }
        ]
    })
    const posts = allUserPosts.map(post => post.get ({ plain: true }));
    console.log(posts.length)
    const postlength = posts.length
    console.log(req.session.username)
    res.render('dashboard', {
        posts,
        postlength,
        username: req.session.username,
        loggedIn: true
    })
}
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// // edit post
// router.get('/edit/:id', withAuth, (req, res) => {
//     Post.findOne({
//             where: {
//                 id: req.params.id
//             },
//             attributes: [
//                 'id',
//                 'title',
//                 'content',
//                 'created_at'
//             ],
//             include: [{
//                     model: User,
//                     attributes: ['username']
//                 },
//                 {
//                     model: Comment,
//                     attributes: [
//                         'id', 
//                         'comment_text', 
//                         'post_id', 
//                         'user_id', 
//                         'created_at'
//                     ],
//                     include: {
//                         model: User,
//                         attributes: ['username']
//                     }
//                 }
//             ]
//         })
//         .then(dbPostData => {
//             if (!dbPostData) {
//                 res.status(404).json({ message: 'No post found with this id' });
//                 return;
//             }

//             const post = dbPostData.get({ plain: true });
//             res.render('edit-post', { post, loggedIn: true });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// })

// // new post 
// router.get('/new', (req, res) => {
//     res.render('new-post');
// });

module.exports = router;