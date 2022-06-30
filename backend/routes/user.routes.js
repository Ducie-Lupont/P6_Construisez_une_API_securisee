const express = require('express')
const router = express.Router()
const userCtrl =require('../Controllers/user.controller')

//Quelles routes emprunter selon le type de requêtes    /!\ l'ordre des éléments entre parenthèses est important /!\
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router