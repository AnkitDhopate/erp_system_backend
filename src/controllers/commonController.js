const bcrypt = require("bcrypt");
const express = require("../connect");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const env = require("dotenv");
var nodemailer = require("nodemailer");

env.config();

exports.register = async (req, res) => {
  const { role } = req.params;

  const { name, contact, email, username, roll_no, branch, dob, password } =
    req.body;
  const profile_pic = process.env.CLIENT_URL + "/public/" + req.file.filename;
  const hash_password = await bcrypt.hash(password, 10);

  if (role === "admin") {
    const admin_exist_check = await express.db.query(
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
  } else if (role === "hod") {
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
            [
              name,
              contact,
              branch,
              email,
              username,
              hash_password,
              profile_pic,
            ],
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
  } else if (role === "principal") {
    const principal_exist_check = await express.db.query(
      "SELECT * FROM principal",
      async (error, principal) => {
        if (error) {
          return res.status(400).json({ err });
        }

        if (principal.length == 0) {
          const temp = await express.db.query(
            "INSERT INTO principal(name, contact, email, username, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?)",
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
        } else {
          return res
            .status(203)
            .json({ error: "Principal profile already exists" });
        }
      }
    );
  } else if (role === "teacher") {
    const temp = await express.db.query(
      "INSERT INTO teacher(name, contact, branch, email, username, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
  } else if (role === "student") {
    const temp = await express.db.query(
      "INSERT INTO students(name, email,username, contact,roll_no, branch, dob, password, profile_pic) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        name,
        email,
        username,
        contact,
        roll_no,
        branch,
        dob,
        hash_password,
        profile_pic,
      ],
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
};

exports.signin = (req, res) => {
  const { role } = req.params;
  const { username, password } = req.body;

  if (role === "admin") {
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
            const token = jwt.sign(
              { _id: result[0]._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1d",
              }
            );
            const { _id, name, email, contact, username, role, profile_pic } =
              result[0];

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
                profile_pic,
              },
            });
          } else {
            return res.status(401).json({ error: "password incorrect" });
          }
        }
      }
    );
  } else if (role === "hod") {
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
            const token = jwt.sign(
              { _id: result[0]._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1d",
              }
            );
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
  } else if (role === "principal") {
    express.db.query(
      "SELECT * FROM principal where username = ?",
      [username],
      async (error, result) => {
        if (error || result.length == 0) {
          return res.status(404).json({ error: "No such user found" });
        }

        if (result) {
          const user = await bcrypt.compare(password, result[0].password);
          if (user) {
            const token = jwt.sign(
              { _id: result[0]._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1d",
              }
            );
            const { _id, name, email, contact, username, role, profile_pic } =
              result[0];

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
                profile_pic,
              },
            });
          } else {
            return res.status(401).json({ error: "password incorrect" });
          }
        }
      }
    );
  } else if (role === "teacher") {
    express.db.query(
      "SELECT * FROM teacher where username = ?",
      [username],
      async (error, result) => {
        if (error || result.length == 0) {
          return res.status(404).json({ error: "No such user found" });
        }

        if (result) {
          const user = await bcrypt.compare(password, result[0].password);
          if (user) {
            const token = jwt.sign(
              { _id: result[0]._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1d",
              }
            );
            const {
              _id,
              name,
              email,
              contact,
              username,
              role,
              branch,
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
                username,
                role,
                branch,
                profile_pic,
              },
            });
          } else {
            return res.status(401).json({ error: "password incorrect" });
          }
        }
      }
    );
  } else if (role === "student") {
    express.db.query(
      "SELECT * FROM students where username = ?",
      [username],
      async (error, result) => {
        if (error || result.length == 0) {
          return res.status(404).json({ error: "No such user found" });
        }

        if (result) {
          const user = await bcrypt.compare(password, result[0].password);
          if (user) {
            const token = jwt.sign(
              { _id: result[0]._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1d",
              }
            );
            const {
              _id,
              name,
              contact,
              email,
              username,
              role,
              roll_no,
              branch,
              dob,
              profile_pic,
            } = result[0];

            res.cookie("token", token, { expiresIn: "1d" });
            return res.status(201).json({
              token,
              user: {
                _id,
                name,
                contact,
                email,
                username,
                role,
                roll_no,
                branch,
                dob,
                profile_pic,
              },
            });
          } else {
            return res.status(401).json({ error: "password incorrect" });
          }
        }
      }
    );
  }
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
  console.log(req.body);
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