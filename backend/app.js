const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const saucesRoutes = require('./routes/sauces.js')
const userRoutes = require('./routes/user')

mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PW}@piiquante.cltzk.mongodb.net/${process.env.DATABASENAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection à MongoDB: Succès!'))
    .catch(() => console.log('Connection à MongoDB: Echec!'))

const app = express()

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(express.json())

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