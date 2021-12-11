const jwt = require("jsonwebtoken");

exports.requireSignIn = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(401).json({ error: "Authorization required" });
  }
  next();
};

// exports.adminMiddleware = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(400).json({ req: req.user });
//   }
//   next();
// };

// exports.userMiddleware = (req, res, next) => {
//   if (req.user.role !== "user") {
//     return res.status(400).json({ error: "Access Denied" });
//   }
//   next();
// };
