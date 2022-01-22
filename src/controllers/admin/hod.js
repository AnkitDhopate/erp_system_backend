const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const env = require("dotenv");
var nodemailer = require("nodemailer");

env.config();

exports.hodRegister = async (req, res) => {
  const { name, contact, email, branch, username, password } = req.body;
  const profile_pic = process.env.CLIENT_URL + "/public/" + req.file.filename;
  const hash_password = await bcrypt.hash(password, 10);

  const hod_exist_check = await express.db.query(
    "SELECT * FROM hod where branch = ?",
    [branch],
    async (error, hod) => {
      if (error) {
        return res.status(400).json({ err });
      }

      if (hod.length === 0) {
        const temp = await express.db.query(
          "INSERT INTO hod(name, contact,branch, email, username, password, profile_pic) VALUES (?, ?, ?, ?, ?,?, ?)",
          [name, contact, branch, email, username, hash_password, profile_pic],
          (err, result) => {
            if (err) {
              return res.status(400).json({ err });
            }

            if (result) {
              return res.status(201).json({ result });
            }
          }
        );
      } else {
        return res.status(203).json({
          error: `Hod has already been appointed for ${branch} Branch`,
        });
      }
    }
  );
};

exports.hodSignin = (req, res) => {
  const { username, password } = req.body;
  express.db.query(
    "SELECT * FROM hod where username = ?",
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
          const {
            _id,
            name,
            email,
            contact,
            branch,
            username,
            role,
            profile_pic,
          } = result[0];

          res.cookie("token", token, { expiresIn: "1d" });

          return res.status(201).json({
            token,
            user: {
              _id,
              name,
              email,
              contact,
              branch,
              username,
              role,
              profile_pic,
            },
          });
        } else {
          return res.status(401).json({ error: "password incorrect" });
        }
      }
    }
  );
};

exports.hodSignout = (req, res) => {
  res.clearCookie("token");
  res.status(201).json({ message: "Logged out successfully" });
};

exports.getAllHodData = async (req, res) => {
  express.db.query("SELECT * FROM hod", async (err, result) => {
    if (err) {
      return res.status(400).json({ err });
    }

    if (result) {
      return res.status(201).json({ result });
    }
    console.log(result);
  });
};

exports.deleteHodData = async (req, res) => {
  const hod_id = req.params._id;
  express.db.query(
    `DELETE FROM hod where _id = ?`,
    [hod_id],
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

exports.editHodData = async (req, res) => {
  const { hod_id, name, email, branch, contact } = req.body;

  express.db.query(
    `UPDATE hod SET name="${name}", email="${email}", contact="${contact}" , branch="${branch}" WHERE _id = ${hod_id} `,
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
    `SELECT * FROM hod WHERE email = ?`,
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
        console.log(error);
        return res.status(401).json({ error });
      } else {
        const currentTime = new Date().getTime();
        const diff = item[0].expires_in - currentTime;

        if (diff < 0) {
          return res.status(400).json({ error: "OTP expried" });
        } else {
          if (otp !== item[0].otp) {
            console.log(item[0].otp);
            console.log(otp);

            return res.status(401).json({ error: "Incorrect OTP" });
          } else {
            const hash_password = await bcrypt.hash(new_password, 10);
            const updatePass = express.db.query(
              `UPDATE hod
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
