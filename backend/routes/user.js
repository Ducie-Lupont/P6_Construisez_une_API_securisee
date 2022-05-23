const express = require('express')
const router = express.Router()
const userCtrl =require('../Controllers/user')
const rateLimiter = require('../middleware/ratelimiter')

router.post('/signup', /*rateLimiter,*/ userCtrl.signup)
router.post('/login', /*rateLimiter,*/ userCtrl.login)

module.exports = router