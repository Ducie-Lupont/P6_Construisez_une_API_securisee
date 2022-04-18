const express = require('express')
const router = express.Router()

const saucesCtrl = require('../Controllers/sauces')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, saucesCtrl.createSauces)
router.put('/:id', auth, multer, saucesCtrl.modifySauces)
router.delete('/:id', auth, saucesCtrl.deleteSauces)
router.get('/:id', auth, saucesCtrl.findOneSauces)
router.get('/', auth, saucesCtrl.findSauces)
router.post('/:id/like', auth, saucesCtrl.userLikeSauces)

module.exports = router;