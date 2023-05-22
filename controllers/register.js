const handleRegister = (req, res, db, bcrypt, emailValidation) => {  
  const { email, name, password } = req.body;
  if(!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const validEmail = emailValidation.validate(email);
  if(!validEmail){
    return res.status(400).json('not a valid email');
  }
  if(password.length < 6) {
    return res.status(400).json('password not long enough')
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister
};