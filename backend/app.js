const express = require("express");
const mongoose = require("mongoose")
const path = require("path");
require("dotenv").config({ path: "./config/.env" });
const rateLimit = require("express-rate-limit");

const app = express();

mongoose
.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PW}@${process.env.DATABASENAME}.cltzk.mongodb.net/Piiquante`,)
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.log('La connexion à mongoDB à échoué', err))

//ratelimiter, pour éviter le spam de requêtes.
const limiter = rateLimit({
  windowMs: 1000 /*ms*/ * 60 /*secondes*/ * 15 /*minutes*/, // soit 15 minutes [c'est a définir en ms donc plutôt que de calculer je prends 1000ms pour une seconde, *le nombre de secondes dans une minute, *le nombre de minutes que je souhaites(et je peux étendre en heures, jours, etc....)]
  max: 10, // Limite chaque IP a 10 requêtes par tranche de 15 minutes
  standardHeaders: true, // Renvoie le statut du ratelimiter aux headers `RateLimit-*`
  legacyHeaders: false, // Désactive le ratelimiter pour les headers `X-RateLimit-*`
});

//Paramétrage CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(express.json());


//routes nécessaires, pour envoyer les bonnes requêtes au bon endroit
const saucesRoutes = require("./routes/sauces.routes");
const userRoutes = require("./routes/user.routes");
//
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", limiter, userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
