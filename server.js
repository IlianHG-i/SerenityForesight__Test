require('dotenv').config()

const express = require('express');
const app = express();


app.use(express.json());

const routes = require('./src/routes/routes');
app.use(routes);

app.listen(3000);