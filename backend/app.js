const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()//requête des données dans le fichier .env

//routes nécessaires, pour envoyer les bonnes requêtes au bon endroit
const saucesRoutes = require('./routes/sauces.js')
const userRoutes = require('./routes/user')

//Lien avec la base de données
mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PW}@piiquante.cltzk.mongodb.net/${process.env.DATABASENAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection à MongoDB: Succès!'))
    .catch(() => console.log('Connection à MongoDB: Echec!'))

const app = express()

const rateLimit = require('express-rate-limit') // j'appelle mon ratelimiter

const limiter = rateLimit({
	windowMs:  1000/*ms*/* 60/*secondes*/ * 15/*minutes*/ , // soit 15 minutes [c'est a définir en ms donc plutôt que de calculer je prends 1000ms pour une seconde, *le nombre de secondes dans une minute, *le nombre de minutes que je souhaites(et je peux étendre en heures, jours, etc....)]
	max: 10, // Limite chaque IP a 10 requêtes par tranche de 15 minutes
	standardHeaders: true, // Renvoie le statut du ratelimiter aux headers `RateLimit-*`
	legacyHeaders: false, // Désactive le ratelimiter pour les headers `X-RateLimit-*`
})

app.use(express.json())

//quelques lignes pour éviter les bloquages de requêtes multi origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', limiter, userRoutes)

module.exports = app