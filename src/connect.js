const mysql = require("mysql");
const express = require("express");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "erp_project_database",
  multipleStatements: true,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  }

  if (!error) {
    console.log("Connected to the database successfully");
  }
});

module.exports = { db };
