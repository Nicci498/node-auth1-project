//add post api/login and post api/register
//add route to api/users router
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');

const usersRouter = require('../users/users-router.js');
router.use('/users', usersRouter);

router.get('/', (req, res) =>{
    res.send('<h1>Connected</h1>')
});

router.post('/register', (req, res) =>{
    let user = req.body;
    let hash = bcrypt.hashSync(user.password, 13);
    user.password = hash;
    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(err =>{
        res.status(500).json(error);
    })
})

router.post('/login', (req, res) =>{
    let { username, password } = req.body;
    console.log(username)
    console.log(password)
    Users.findBy({username})
    .first()
    .then(user =>{
        if(user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
            res.status(401).json({message: 'Invalid Credentials'})
        }
    })
    .catch(({ name, message ,stack}) =>{res.status(500).json({name, message, stack})})
})

module.exports = router;