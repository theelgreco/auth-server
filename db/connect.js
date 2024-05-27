const {Pool} = require("pg")

exports.db = new Pool({connectionString: process.env.DATABASE_URL})