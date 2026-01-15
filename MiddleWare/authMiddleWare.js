const jwt = require("jsonwebtoken");
const users = require("../Models/usersModel");
// Middleware to verify JWT
const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer Token
  if (!token) return res.status(401).json({ message: "Token not provided" });
  // console.log("token", token);
  // const decodetoken = jwt.decode(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, users) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = users;
    next();
  });
};
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles);
      console.log(req.user);
      return res
        .status(403)
        .json({ message: "Access Denied: Role not allowed" });
    }
    next();
  };
};
module.exports = { authToken, authorizeRoles };
