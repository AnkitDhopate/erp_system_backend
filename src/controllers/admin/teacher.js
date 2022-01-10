const bcrypt = require("bcrypt");
const express = require("../../connect");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const env = require("dotenv");
const mailgun = require("mailgun-js");

env.config();

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

exports.teacherRegister = async (req, res) => {
  const { name, contact, branch, email, username, password } = req.body;
  const profile_pic = process.env.CLIENT_URL + "/public/" + req.file.filename;
  const hash_password = await bcrypt.hash(password, 10);

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
};



// exports.teacherRegister = async (req, res) => {
//   const { name, contact, branch, email, username, password } = req.body;

//   const checkUser = await express.db.query(
//     "SELECT * FROM teacher WHERE username = ?",
//     [username],
//     (err, result) => {
//       if (err) {
//         return res.status(400).json({ err });
//       }

//       if (result.length > 0) {
//         return res.status(400).json({ error: "Username already exists" });
//       } else {
//         const registerToken = jwt.sign(
//           { name, contact, branch, email, username, password },
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

// exports.verifyToken = (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     jwt.verify(token, process.env.JWT_REGISTER_KEY, async (error, result) => {
//       if (error) {
//         return res.status(400).json({ error });
//       }

//       if (result) {
//         const { name, contact, email, username, password } = result;
//         const hash_password = await bcrypt.hash(password, 10);

//         const temp = await express.db.query(
//           "INSERT INTO teacher(name, contact, branch, email, username, password) VALUES (?, ?, ?, ?, ?, ?)",
//           [name, contact, branch, email, username, hash_password],
//           (err, result) => {
//             if (err) {
//               return res.status(400).json({ err });
//             }

//             if (result) {
//               return res.status(201).json({ result });
//             }
//           }
//         );
//       }
//     });
//   } else {
//     return res.status(400).json({ error: "Something went wrong" });
//   }
// };

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
          const token = jwt.sign({ _id: result[0]._id }, process.env.JWT_KEY, {
            expiresIn: "1d",
          });
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

exports.getAllTeacherData = async (req, res) => {
  express.db.query("SELECT * FROM teacher", async (err, result) => {
    if (err) {
      return res.status(400).json({ err });
    }

    if (result) {
      return res.status(201).json({ result });
    }
    console.log(result);
  });
};

exports.deleteTeacherData = async (req, res) => {
  const tech_id = req.params._id;
  express.db.query(
    `DELETE FROM teacher where _id = ?`,
    [tech_id],
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

exports.editTeacherData = async (req, res) => {
  const { tech_id, name, email, branch, contact } = req.body;

  express.db.query(
    `UPDATE teacher SET name="${name}", email="${email}", contact="${contact}", branch="${branch}" WHERE _id = ${tech_id} `,
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
