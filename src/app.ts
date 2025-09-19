import("./db/connect.ts");

import process from "node:process";
import dotenv from "dotenv";

// module imports
import express from "express";
import logger from "morgan";
import cors from "cors";
import { postSignUp, postLogin } from "./controllers/controllers.ts";
import { handleCustomErrors, handlePostgresErrors, handle500Errors } from "./errors/middleware.ts";

dotenv.config();

// setup
const app = express();
const PORT = process.env.PORT || 9091;

// middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// endpoints
app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome!!" });
});

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
