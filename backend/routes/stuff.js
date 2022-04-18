const express = require('express')
const router = express.Router()

const stuffCtrl = require('../Controllers/stuff')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, stuffCtrl.createThing)
router.put('/:id', auth, multer, stuffCtrl.modifyThing)
router.delete('/:id', auth, stuffCtrl.deleteThing)
router.get('/:id', auth, stuffCtrl.findOneThing)
router.get('/', auth, stuffCtrl.findThings)

module.exports = router;