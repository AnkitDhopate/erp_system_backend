const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const env = require("dotenv");
const mailgun = require("mailgun-js");

env.config();

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

exports.adminRegister = async (req, res) => {
  const { name, contact, email, username, password, resetLink } = req.body;

  const checkUser = await express.db.query(
    "SELECT * FROM admin WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        const registerToken = jwt.sign(
          { name, contact, email, username, password, resetLink },
          process.env.JWT_REGISTER_KEY,
          { expiresIn: "20m" }
        );

        const data = {
          from: "noreply@hello.com",
          to: email,
          subject: "ERP System Account activation",
          html: `
            <h2>Please click below link for activation</h2>
            <a href=${process.env.CLIENT_URL}/authentication/activate/${registerToken}>${process.env.CLIENT_URL}/authentication/verify-token/${registerToken}</a>
          `,
        };

        mg.messages().send(data, function (error, body) {
          console.log(body);
          if (error) {
            return res.status(400).json({ error: error.message });
          }

          return res.status(201).json({
            message:
              "Email has been sent successfully, kindly activate your account",
          });
        });
      }
    }
  );
};

exports.verifyToken = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_REGISTER_KEY, async (error, result) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (result) {
        const { name, contact, email, username, password, resetLink } = result;
        const hash_password = await bcrypt.hash(password, 10);

        const temp = await express.db.query(
          "INSERT INTO admin(name, contact, email, username, password, resetLink) VALUES (?, ?, ?, ?, ?, ?)",
          [name, contact, email, username, hash_password, resetLink],
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
      console.log(process.env.JWT_KEY);
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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const checkUser = await express.db.query(
    "SELECT * FROM admin WHERE email = ?",
    [email],
    async (error, user) => {
      if (error || !user) {
        return res.status(400).json({ error });
      }

      const forgotPassToken = jwt.sign(
        { email },
        process.env.RESET_PASSWORD_KEY,
        { expiresIn: "20m" }
      );

      const data = {
        from: "noreply@hello.com",
        to: email,
        subject: "ERP Forgot Password Reset Link",
        html: `
            <h2>Please click below link to reset your password</h2>
            <p>${process.env.CLIENT_URL}/resetpassword/${forgotPassToken}</p>
          `,
      };

      const updateResetLinkCol = await express.db.query(
        `UPDATE admin SET resetLink=? WHERE email = ?`,
        [forgotPassToken, email],
        (err, result) => {
          if (err) {
            return res.status(400).json({ error });
          }

          mg.messages().send(data, (e, body) => {
            if (e) {
              return res.status(400).json({ error: e });
            }

            return res.status(200).json({
              message: "Email has been sent, kindly follow the instructions",
            });
          });
        }
      );
    }
  );
};

exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, process.env.RESET_PASSWORD_KEY, async (error, result) => {
    if (error) {
      return res.status(400).json({ error });
    }

    const checkResetLinkStatus = await express.db.query(
      `SELECT resetLink FROM admin WHERE email = ?`,
      [result.email],
      async (err, resetLinkStat) => {
        if (err) {
          return res.status(400).json({ err });
        }

        if (resetLinkStat.length <= 0) {
          return res.status(400).json({
            error:
              "User not requested to forgot password. You are fucking hacker",
          });
        }

        const hash_password = await bcrypt.hash(newPassword, 10);

        const updateUser = await express.db.query(
          `UPDATE admin SET resetLink = '', password = ? WHERE email = ?`,
          [hash_password, result.email],
          (e, d) => {
            if (e) {
              return res.status(400).json({ err });
            }

            return res.status(200).json({ msg: "Password Updated" });
          }
        );
      }
    );
  });
};
