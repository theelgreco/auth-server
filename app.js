// module imports
const express = require('express');
const logger = require('morgan');
const cors = require('cors')

// local imports

// setup
const app = express();
const PORT = process.env.PORT || 9090

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (request, response) => {
    response.send({msg: "hi"})
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})