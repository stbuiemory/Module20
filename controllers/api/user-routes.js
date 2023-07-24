const { Post, User, Comment } = require('../../models');
const router = require('express').Router();

// GET all users (excluding password field)
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.status(200).json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET user by id, including their posts and comments
router.get('/:id', async (req, res) => {
    try {
        const oneUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'post_body', 'created_at'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_body', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title'],
                    },
                },
            ],
        });

        if (!oneUser) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.status(200).json(oneUser);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch the user.' });
    }
});

// CREATE new user
router.post('/', async (req, res) => {
    try {
        // Check if the username is unique
        const uniqueUsername = await User.findOne({ where: { username: req.body.username } });
        if (uniqueUsername) {
            res.status(409).json({ message: 'This username is taken! Please try again.' });
            return;
        }
        
        // Check the username and password lengths
        if (req.body.username.length < 4) {
            res.status(411).json({ message: 'Usernames must be at least 4 characters!' });
            return;
        }
        if (req.body.password.length < 8) {
            res.status(410).json({ message: 'Passwords must be at least 8 characters!' });
            return;
        }
        
        // Create the new user
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password,
        });
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;
            res.status(200).json(newUser);
            console.log('New user created!');
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create the user.' });
    }
});

// LOGIN user
router.post('/login', async (req, res) => {
    try {
        const userLoginData = await User.findOne({
            where: { username: req.body.username },
        });
        if (!userLoginData) {
            res.status(400).json({ message: 'No user with that username.' });
            return;
        }
        
        // Check the password
        const matchPassword = await userLoginData.checkPassword(req.body.password);
        if (!matchPassword) {
            res.status(400).json({ message: 'Password is incorrect.' });
            return;
        }
        
        // Set user session and respond with a success message
        req.session.save(() => {
            req.session.user_id = userLoginData.id;
            req.session.username = userLoginData.username;
            req.session.loggedIn = true;
            res.json({ user: userLoginData, message: 'Successfully logged in!' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to log in.' });
    }
});

// LOGOUT user
router.post('/logout', async (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
            console.log('User is logged out.');
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
