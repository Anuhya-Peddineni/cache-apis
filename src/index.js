const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const cacheRoutes = require('./controller/CacheApiRoutesController');
const env = require('../env');

const port = env.Port;
const mongoDbUrl = env.MongoDbUrl;

mongoose.connect(mongoDbUrl, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.on('open', () => {
    console.log('Connection to DB established successfully');
});

const app = express();
app.use(bodyParser.json());
app.use(errorHandler());
app.use('/cache', cacheRoutes);
app.listen(port,()=>console.log(`Server listening on PORT: http://localhost:${port}`));
