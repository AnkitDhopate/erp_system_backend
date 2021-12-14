const express = require(".././connect");

const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.studentRegister = async (req, res) => {
  const { name, contact, email, username, roll_no, branch, dob, password } =
    req.body;
  const hash_password = await bcrypt.hash(password, 10);
  const data = express.db;
  const temp = await data.query(
    "INSERT INTO students(name, email,username, contact,roll_no, branch, dob, password) VALUES (?,?,?,?,?,?,?,?)",
    [name, email, username, contact, roll_no, branch, dob, hash_password],
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

exports.studentSignin = async (req, res) => {
  const { username, password } = req.body;
  express.db.query(
    "SELECT * FROM students where username = ?",
    [username],
    async (error, result) => {
      if (error) {
        return res.status(404).json({ error: "No such user found" });
      }

      if (result) {
        const user = await bcrypt.compare(password, result[0].password);
        if (user) {
          const token = jwt.sign(
            { _id: result[0].std_id },
            "this-is-secrete-key-store-it-in-.env",
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
            },
          });
        } else {
          return res.status(401).json({ error: "password incorrect" });
        }
      }
    }
  );
};

exports.studentSignout = (req, res) => {
  res.clearCookie("token");
  res.status(201).json({ message: "Logged out successfully " });
};
