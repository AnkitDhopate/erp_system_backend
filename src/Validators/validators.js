const { body, validationResult } = require("express-validator");

exports.validateSignupRequest = [
  body("name").exists().notEmpty().withMessage("Name is required"),
  body("email").exists().isEmail().withMessage("Enter valid email"),
  body("branch").notEmpty().withMessage("Select valid Branch"),
  body("roll_no").notEmpty().withMessage("Roll no is required"),
  body("dob").notEmpty().withMessage("Select Date Of Birth"),
  body("username").exists().notEmpty().withMessage("username is required"),
  body("contact")
    .exists()
    .isMobilePhone()
    .withMessage("Enter valid Mobile no. "),
  body("password")
    .exists()
    .isLength({ min: 5 })
    .withMessage("Password must be atleast 5 digit long"),
];

// exports.validateSignupRequestAdmin = [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Enter valid email"),
//   body("contact").notEmpty().withMessage("Enter valid Mobile no."),
//   body("username").notEmpty().withMessage("username is required"),
//   body("password")
//     .isLength({ min: 5 })
//     .withMessage("Password must be atleast 5 digit long"),
// ];

// exports.validateSignupRequesthod = [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Enter valid email"),
//   body("contact").notEmpty().withMessage("Enter valid Mobile no."),
//   body("branch").notEmpty().withMessage("Select valid Branch"),
//   body("username").notEmpty().withMessage("username is required"),
//   body("password")
//     .isLength({ min: 5 })
//     .withMessage("Password must be atleast 5 digit long"),
// ];

exports.validateSigninRequest = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be atleast 5 digit long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array() });
  }

  next();
};
