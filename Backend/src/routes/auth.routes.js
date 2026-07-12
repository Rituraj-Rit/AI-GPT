let express = require('express')
let authControllers = require('../controllers/auth.controller')
let router = express.Router()

router.post('/register', authControllers.RegisterUser)
router.post('/login', authControllers.loginUser)


module.exports = router