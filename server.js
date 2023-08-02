const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Helper functions
const helpers = require('./utils/helpers');

require('dotenv').config();

const sequelize = require('./config/connection');

const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuring the Handlebars engine with custom helpers
const hbs = exphbs.create({ helpers });

// Session configuration
const sess = {
    secret: 'Apple Tree', 
    cookie: {
        maxAge: 600000, 
    },
    resave: false,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize, 
    }),
};

// Middleware
app.use(session(sess));

// Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for parsing JSON data and url-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    
    app.listen(PORT, () => console.log(`App now listening on ${PORT}!`));
});