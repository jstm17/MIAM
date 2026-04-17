const { verifyJwt } = require("../utils/jwtUtils");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: true,
      message: "Token manquant",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Token invalide",
    });
  }
};

const authOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    return next();
  } catch (error) {
    // Si le token est expiré ou invalide, on laisse passer la requête
    // en mode invité pour les routes publiques.
    req.user = undefined;
    return next();
  }
};

module.exports = {
  auth,
  authOptional,
};
