require("dotenv").config();
require("./db/connect");
require("./db/initialise")();

// module imports
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const { postSignUp, postLogin } = require("./controllers/controllers");
const { handleCustomErrors, handlePostgresErrors, handle500Errors } = require("./errors/middleware");

// setup
const app = express();
const PORT = process.env.PORT || 9091;

// middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// endpoints
app.post("/sign-up", postSignUp);

app.post("/login", postLogin);

// error-handling middleware
app.use(handleCustomErrors);
app.use(handlePostgresErrors);
app.use(handle500Errors);

// Listener
app.listen(PORT, "0.0.0.0", () => {
    console.log("-------------------------------------");
    console.log(`Server listening on port ${PORT}`);
    console.log(`View here: http://localhost:${PORT}`);
    console.log("-------------------------------------");
});
