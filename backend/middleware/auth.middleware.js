const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //vérification de la validité du token d'authentification
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID Not Valid";
    } else {
      next();
    }
  } catch (error) {
    //Si le token n'est pas le bon>
    console.log(error);
    res.status(401).json({ error: "Unauthentified Request !" });
  }
};

module.exports.getUserId = (req) => {
  try {
    //Vérification de l'utilisateur connecté
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    return userId;
  } catch (error) {
    console.log(error);
  }
};
