const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");

exports.requireSignIn = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, "this-is-secrete-key-store-it-in-.env");
    req.user = user;
  } else {
    return res.status(401).json({ error: "Authorization required" });
  }
  next();
};

const storage = multer.diskStorage({
  destination: function (res, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage });

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
