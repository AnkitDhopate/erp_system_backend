const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");

exports.hodRegister = async (req, res) => {
  const { name, contact, email, branch, username, password } = req.body;
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
