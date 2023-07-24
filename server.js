const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const helpers = require('./utils/helpers')
require('dotenv').config()

const sequelize = require('./config/connection');
const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
    secret: 'super secret secret',
    cookie: {
        maxAge: 600000
    },
    resave: false,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App now listening on ${PORT}!`));
});