const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const emailValidation = require('nodejs-email-validation');

const register = require('./controllers/register');
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');


const db = knex({
    client: 'pg',
        connection: process.env.DB_CONNECTION,
        pool: {
            min: 0
        }
});

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt, emailValidation) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, emailValidation) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
    console.log('app is running');
})