const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('requete receptionnee')
    next()
})

app.use((req, res, next) =>{
    res.status(201)
    next()
})

app.use((req, res, next) => {
    res.json({ message: 'bbb' })
    next()
})

app.use((req, res) =>{
    console.log('ccc')
})

module.exports = app