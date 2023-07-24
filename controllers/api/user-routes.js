const { Post, User, Comment } = require('../../models');
const router = require('express').Router();

// get users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(userData => res.status(200).json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get user by id
router.get('/:id', async (req, res) => {
    try {
        const oneUser = await User.findByPk(req.params.id, {
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: ['password'],
            },
            include: [{
                model: Post,
                attributes: [
                    'id',
                    'title',
                    'post_body',
                    'created_at'
                ]
            },
            {
                model: Comment,
                attributes: [
                'id',
                'comment_body',
                'created_at'
                ], 
                include: {
                    model: Post,
                    attributes: ['title']
                    }
                },
            ]
        })
        if (!oneUser) {
            res.status(404).json({ message: 'No user found with this id!' })
        }
        res.status(200).json(oneUser)
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create new user
router.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const uniqueUsername = await User.findOne({ where: { username: req.body.username } });
        if (uniqueUsername) { 
            res.status(409).json({ message: 'This username is taken! Please enter a unique username.' });
            return;
        }
        if (req.body.username.length < 4) {
            res.status(411).json({ message: 'Your username must be at least 4 characters!' });
            return;
        }
        if (req.body.password.length < 8) {
            res.status(410).json({ message: 'Your password must be at least 8 characters!' });
            return;
        }
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password
        },
        {
            individualHooks: true
        })
        req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.username = newUser.username;
        req.session.password = newUser.password;
        req.session.loggedIn = true;
        res.status(200).json(newUser)
        console.log("New user created!")
        })   
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// login user
router.post('/login', async (req, res) => {
    try{
        const userLoginData = await User.findOne({
            where: {
                username: req.body.username
            }
    })
    if (!userLoginData) {
                res.status(400).json({ message: 'No user with that username! '});
                return;
            }
    const matchPassword = await userLoginData.checkPassword(req.body.password);
    if (!matchPassword) {
        res.status(400).json({ message: 'Password is incorrect!' });
        return;
    }
    req.session.save(() => {
        req.session.user_id = userLoginData.id;
        req.session.username = userLoginData.username;
        req.session.loggedIn = true;
        res.json({ user: userLoginData, message: 'Successfully logged in!' });
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// logout user
router.post('/logout', async (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
            console.log('User is logged out')
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;