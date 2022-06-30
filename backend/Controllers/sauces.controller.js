const Sauces = require('../models/Sauces.model')
const fs = require('fs')
const { getUserId } = require('../middleware/auth.middleware')

//création d'une sauce
exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce)
    delete saucesObject._id
    const sauces = new Sauces({
        ...saucesObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()//sauvegarde de la sauce créée
        .then(() => res.status(201).json({ message: 'Post saved successfully!' }))
        .catch((error) => res.status(400).json({ error: error }))
}

//Modification d'une sauce
exports.modifySauces = (req, res, next) => {
    const userId = getUserId(req)
    if (req.file) {
        const saucesObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        Sauces.findOne({ _id: req.params.id })
            .then(sauces => {
                if (sauces.userId != userId) {
                    return res.status(401).json({ error: 'Unauthorized Request!' })
                }
                const filename = sauces.imageUrl.split('/images/')[1]
                Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
                    .then(() => {
                        fs.unlink(`images/${filename}`, () => { })
                        res.status(201).json({ message: 'Sauces updated successfully!' })
                    })
                    .catch((error) => res.status(400).json({ error: error }))
            })
    }
    else {
        Sauces.findOne({ _id: req.params.id })
            .then(sauces => {
                if (sauces.userId != userId) {
                    return res.status(401).json({ error: 'Unauthorized Request!' })
                }

                const saucesObject = { ...req.body }
                Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
                    .then(() => {
                        res.status(201).json({ message: 'Sauces updated successfully!' })
                    })
                    .catch((error) => res.status(400).json({ error: error }))
            })
    }

}

//suppression d'une sauce
exports.deleteSauces = (req, res, next) => {
    const userId = getUserId(req)
    Sauces.findOne({ _id: req.params.id })
        .then(sauces => {
            if (sauces.userId != userId) {
                return res.status(401).json({ error: 'Unauthorized Request!' })
            }
            const filename = sauces.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Deleted!' }))
                    .catch((error) => res.status(400).json({ error: error }))
            })
        })
        .catch(error => res.status(500).json({ error }))

}

//chargement d'une sauce précise(affichage des détails d'une sauce par exemple)
exports.findOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error: error }))
}

//charge toutes les sauces
exports.findSauces = (req, res, next) => {
    Sauces.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }))
}

//Gestion des likes
exports.userLikeSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            if (req.body.like === -1) {
                if (!sauces.usersDisliked.includes(req.body.userId)){
                    sauces.dislikes++
                    sauces.usersDisliked.push(req.body.userId)
                    sauces.save()
                }
            }
            else if (req.body.like === 1) {
                if (!sauces.usersLiked.includes(req.body.userId)) {
                    sauces.likes++
                    sauces.usersLiked.push(req.body.userId)
                    sauces.save()
                }
            }
            else if (req.body.like === 0) {
                if (sauces.usersDisliked.includes(req.body.userId)) {
                    sauces.usersDisliked.splice(sauces.usersDisliked.indexOf(req.body.userId), 1)
                    sauces.dislikes--
                }
                else if (sauces.usersLiked.includes(req.body.userId)) {
                    sauces.usersLiked.splice(sauces.usersLiked.indexOf(req.body.userId), 1)
                    sauces.likes--
                }
                sauces.save()
            }
            else {
                res.status(400).json({ error: 'Erreur!' })
                return
            }
            res.status(200).json(sauces)
        })
        .catch((error) => res.status(404).json({ error: error }))
}