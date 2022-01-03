const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const mailgun = require("mailgun-js");

env.config();

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

exports.hodRegister = async (req, res) => {
  const { name, contact, email, branch, username, password } = req.body;

  const checkUser = await express.db.query(
    "SELECT * FROM hod WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        const registerToken = jwt.sign(
          { name, contact, branch, email, username, password },
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
        console.log(result);
        const { name, contact, email, branch, username, password } = result;
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
                "INSERT INTO hod(name, contact,branch, email, username, password) VALUES (?, ?, ?, ?, ?,?)",
                [name, contact, branch, email, username, hash_password],
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
    });
  } else {
    return res.status(400).json({ error: "Something went wrong" });
  }
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
          const { _id, name, email, contact, branch, username, role } =
            result[0];

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
