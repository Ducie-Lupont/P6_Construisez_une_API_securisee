const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User.model')

//envoi des données d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()//sauvegarde des données
                .then(() => res.status(201).json({ message: 'User Successfully Created!' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

//Login d'un usilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {//si l'utilisateur n'est pas trouvé on donne une erreur 401
                return res.status(401).json({ error: 'User Not Find !' })
            }
            bcrypt.compare(req.body.password, user.password)//verification du mot de passe, si l'utilisateur et valide
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Password Not Valid!' })//mauvais mot de passe
                    }
                    res.status(200).json({//mot de passe correct= attribution du token de connexion
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}