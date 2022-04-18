const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const stuffRoutes = require('./routes/stuff.js')
const userRoutes = require('./routes/user')

mongoose.connect('mongodb+srv://test:test@lessonscluster.cltzk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection à MongoDB: Succès!'))
    .catch(() => console.log('Connection à MongoDB: Echec!'))

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/stuff', stuffRoutes)
app.use('/api/auth', userRoutes)

module.exports = app