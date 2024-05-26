const {Pool} = require("pg")

const {DATABASE_URL} = process.env

let connectionString = ""

if (DATABASE_URL) connectionString = DATABASE_URL

