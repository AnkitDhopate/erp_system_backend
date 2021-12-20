const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");

exports.teacherRegister = async (req, res) => {
  const { name, contact, branch, email, username, password } = req.body;
  const hash_password = await bcrypt.hash(password, 10);

  const temp = await express.db.query(
    "INSERT INTO teacher(name, contact, branch, email, username, password) VALUES (?, ?, ?, ?, ?, ?)",
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
};

exports.teacherSignin = (req, res) => {
  const { username, password } = req.body;
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
            { _id: result[0].teacher_id },
            "this-is-secrete-key-store-it-in-.env",
            {
              expiresIn: "1d",
            }
          );
          const { _id, name, email, contact, username, role, branch } =
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
              branch,
            },
          });
        } else {
          return res.status(401).json({ error: "password incorrect" });
        }
      }
    }
  );
};

exports.teacherSignout = (req, res) => {
  res.clearCookie("token");
  res.status(201).json({ message: "Logged out successfully" });
};
