const express = require('express');
const apiRouter = require('./api-router.js');
const morgan = require('morgan');
const session = require('express-session');
const KnexStore = require('connect-session-knex')(session);//remember to curry and pass the session
const knex = require('../data/dbConfig.js');
const server = express();
let sessionConfig = {
    name: 'User',//default sid
    secret: 'keep it secret, keep it safe',
    cookie: {
        maxAge: 1000 * 60 * 3, //30 seconds b4 cookie expires
        secure: false, //only false during development, true in production
        httpOnly: true, //cannot be accessed via javacript
    },
    store: new KnexStore({
        knex: knex,
        tablename: 'sessions',
        createtable: true,
        sidfieldname: 'sid',
        clearInterval: 1000 * 60 * 15,
    }),// remember the 'new' keyword
    resave: false,
    saveUninitialized: false //should be false until user accepts using cookies
}
server.use(express.json());
server.use(morgan('dev'));
server.use(session(sessionConfig));

server.use('/api', apiRouter);

module.exports = server;