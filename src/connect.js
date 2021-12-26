const mysql = require("mysql");
const express = require("express");
const env = require("dotenv");
env.config();

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: process.env.MYSQL_PASSWORD,
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
