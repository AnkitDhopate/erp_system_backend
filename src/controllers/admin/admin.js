const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const env = require("dotenv");
var nodemailer = require("nodemailer");
const mailgun = require("mailgun-js");

env.config();

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

exports.adminRegister = async (req, res) => {
  console.log(req);
  const { name, contact, email, username, password } = req.body;
  const profile_pic = process.env.CLIENT_URL + "/public/" + req.file.filename;
  const hash_password = await bcrypt.hash(password, 10);

  const temp = await express.db.query(
    "INSERT INTO admin(name, contact, email, username, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?)",
    [name, contact, email, username, hash_password, profile_pic],
    (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (result) {
        return res.status(201).json({ result });
      }
    }
  );
};

// exports.adminRegister = async (req, res) => {
//   const { name, contact, email, username, password } = req.body;

//   const checkUser = await express.db.query(
//     "SELECT * FROM admin WHERE username = ?",
//     [username],
//     (error, result) => {
//       if (error) {
//         return res.status(400).json({ error });
//       }

//       if (result.length > 0) {
//         return res.status(400).json({ error: "Username already exists" });
//       } else {
//         const registerToken = jwt.sign(
//           { name, contact, email, username, password },
//           process.env.JWT_REGISTER_KEY,
//           { expiresIn: "20m" }
//         );

//         const data = {
//           from: "noreply@hello.com",
//           to: email,
//           subject: "ERP System Account activation",
//           html: `
//             <h2>Please click below link for activation</h2>
//             <a href=${process.env.CLIENT_URL}/authentication/activate/${registerToken}>${process.env.CLIENT_URL}/authentication/verify-token/${registerToken}</a>
//           `,
//         };

//         mg.messages().send(data, function (error, body) {
//           console.log(body);
//           if (error) {
//             return res.status(400).json({ error: error.message });
//           }

//           return res.status(201).json({
//             message:
//               "Email has been sent successfully, kindly activate your account",
//           });
//         });
//       }
//     }
//   );
// };

exports.verifyToken = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_REGISTER_KEY, async (error, result) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (result) {
        const { name, contact, email, username, password } = result;
        const hash_password = await bcrypt.hash(password, 10);

        const temp = await express.db.query(
          "INSERT INTO admin(name, contact, email, username, password) VALUES (?, ?, ?, ?, ?)",
          [name, contact, email, username, hash_password],
          (err, result) => {
            if (err) {
              return res.status(400).json({ err });
            }

            if (result) {
              return res.status(201).json({ result });
            }
          }
        );
      }
    });
  } else {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.adminSignin = (req, res) => {
  const { username, password } = req.body;
  express.db.query(
    "SELECT * FROM admin where username = ?",
    [username],
    async (error, result) => {
      if (error || result.length == 0) {
        return res.status(404).json({ error: "No such user found" });
      }
      if (result) {
        const user = await bcrypt.compare(password, result[0].password);
        if (user) {
          const token = jwt.sign({ _id: result[0]._id }, process.env.JWT_KEY, {
            expiresIn: "1d",
          });
          const { _id, name, email, contact, username, role } = result[0];

          res.cookie("token", token, { expiresIn: "1d" });

          return res.status(201).json({
            token,
            user: {
              _id,
              name,
              email,
              contact,
              username,
              role,
            },
          });
        } else {
          return res.status(401).json({ error: "password incorrect" });
        }
      }
    }
  );
};

exports.adminSignout = (req, res) => {
  res.clearCookie("token");
  res.status(201).json({ message: "Logged out successfully" });
};

exports.getAllAdminData = async (req, res) => {
  express.db.query("SELECT * FROM admin", async (err, result) => {
    if (err) {
      return res.status(400).json({ err });
    }

    if (result) {
      return res.status(201).json({ result });
    }
    console.log(result);
  });
};

exports.deleteAdminData = async (req, res) => {
  const adm_id = req.params._id;
  express.db.query(
    `DELETE FROM admin where _id = ?`,
    [adm_id],
    async (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (result) {
        return res.status(201).json({ result });
      }
      console.log(result);
    }
  );
};

exports.editAdminData = async (req, res) => {
  const { _id, name, email, contact } = req.body;

  express.db.query(
    `UPDATE admin SET name="${name}", email="${email}", contact="${contact}" WHERE _id = ${_id} `,
    (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (result) {
        return res.status(201).json({ result });
      }
      console.log(result);
    }
  );
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const checkUser = express.db.query(
    `SELECT * FROM admin WHERE email = ?`,
    [email],
    async (error, user) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (user.length == 0) {
        return res.status(400).json({ error: "no such user found" });
      }

      const otpcode = Math.floor(Math.random() * 10000 + 1);

      const otp_data = await express.db.query(
        `INSERT INTO otp(email, otp, expires_in) VALUES (?, ?, ?)`,
        [email, otpcode, new Date().getTime() + 600000],
        async (e, r) => {
          if (e) {
            return res.status(400).json({ e });
          } else {
            mailer(email, otpcode);
            return res
              .status(201)
              .json({ message: "OTP successfully sent to your email" });
          }
        }
      );
    }
  );
};

const mailer = (email, otp) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    source: false,
    auth: {
      user: "mailid.erpas@gmail.com",
      pass: "ankit@swap",
    },
  });

  var mailOptions = {
    from: "mailid.erpas@gmail.com",
    to: email,
    subject: "Forgot Password OTP request",
    html: `
    <h3>The OTP is</h3>
    <p>${otp}</p>
    `,
  };

  transporter.sendMail(mailOptions, (e, i) => {
    if (e) {
      console.log(e);
    } else {
      console.log("Successfully sent mail");
    }
  });
};

exports.resetPassword = (req, res) => {
  const { email, otp, new_password } = req.body;

  const checkOTP_Email = express.db.query(
    `SELECT * FROM otp WHERE email = ?`,
    [email],
    async (error, item) => {
      if (error) {
        return res.status(401).json({ error });
      } else {
        const currentTime = new Date().getTime();
        const diff = item[0].expires_in - currentTime;

        if (diff < 0) {
          return res.status(400).json({ error: "OTP expried" });
        } else {
          if (otp !== item[0].otp) {
            return res.status(401).json({ error: "Incorrect OTP" });
          } else {
            const hash_password = await bcrypt.hash(new_password, 10);
            const updatePass = express.db.query(
              `UPDATE admin
            SET password = ?
            WHERE email = ?;`,
              [hash_password, email],
              async (e, r) => {
                if (e) {
                  return res.status(401).json({ e });
                } else {
                  const deleteOTP = await express.db.query(
                    `DELETE FROM otp WHERE email = ?;`,
                    [email],
                    (ee, dd) => {
                      if (ee) {
                        console.log("error while deleting otp");
                      }
                    }
                  );
                  return res
                    .status(201)
                    .json({ message: "Password updated successfully" });
                }
              }
            );
          }
        }
      }
    }
  );
};
