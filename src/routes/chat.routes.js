let express = require('express')
let authMiddleware = require('../middlewares/auth.middleware')
let chatController = require('../controllers/chat.controller')
let router = express.Router()


router.post('/', authMiddleware.authUser, chatController.createChat);


module.exports = router  