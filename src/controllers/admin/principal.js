const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");

exports.principalRegister = async (req, res) => {
  const { name, contact, email, username, password } = req.body;
  const hash_password = await bcrypt.hash(password, 10);

  const principal_exist_check = await express.db.query(
    "SELECT * FROM principal",
    async (error, principal) => {
      if (error) {
        return res.status(400).json({ err });
      }

      if (principal.length == 0) {
        const temp = await express.db.query(
          "INSERT INTO principal(name, contact, email, username, password) VALUES (?, ?, ?, ?, ?)",
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
      } else {
        return res
          .status(401)
          .json({ error: "Principal profile already exists" });
      }
    }
  );
};

exports.principalSignin = (req, res) => {
  const { username, password } = req.body;
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
            { _id: result[0].teacher_id },
            "this-is-secrete-key-store-it-in-.env",
            {
              expiresIn: "1d",
            }
          );
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

exports.principalSignout = (req, res) => {
  res.clearCookie("token");
  res.status(201).json({ message: "Logged out successfully" });
};
