const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");

exports.adminRegister = async (req, res) => {
  const { name, contact, email, username, password } = req.body;
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
          const token = jwt.sign(
            { _id: result[0]._id },
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
