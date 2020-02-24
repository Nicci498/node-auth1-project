const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./users-model.js');

router.get('/', restricted, (req, res) => {
    Users.find()
    .then(users =>{
        res.json(users);
    })
    .catch(err => res.send(err));
})

module.exports = router;

function restricted(req, res, next){
    const { username, password } = req.headers;
  
    if(username && password){
      Users.findBy({username})
      .first()
      .then(user =>{
        if(user && bcrypt.compareSync(password, user.password)) {
          next()
        } else{
          res.status(401).json({message:'you shall not pass with valid credentials'})
        }
      })
      .catch(err =>{res.status(500).json({message:'you shall not pass'})})
    }else{
      res.status(401).json({message:'you shall not pass without valid credentials'})
    }
    
  }