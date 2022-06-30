const express = require('express')
const router = express.Router()

const saucesCtrl = require('../Controllers/sauces.controller')
const auth = require('../middleware/auth.middleware')
const multer = require('../middleware/multer-config.middleware')

//Quelles routes emprunter selon le type de requêtes    /!\ l'ordre des éléments entre parenthèses est important /!\//
router.post('/', auth, multer, saucesCtrl.createSauces)
router.put('/:id', auth, multer, saucesCtrl.modifySauces)
router.delete('/:id', auth, saucesCtrl.deleteSauces)
router.get('/:id', auth, saucesCtrl.findOneSauces)
router.get('/', auth, saucesCtrl.findSauces)
router.post('/:id/like', auth, saucesCtrl.userLikeSauces)

module.exports = router;