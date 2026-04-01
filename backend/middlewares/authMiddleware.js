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

module.exports = {
  auth,
};
