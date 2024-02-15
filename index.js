const express = require('express');
const mongoose = require('mongoose')
const itemRouter = require('./itemRouter');
const itemDetailRouter = require('./itemDetailRouter')
const itemSubmitlRouter = require('./itemSubmitRouter')
const userRegrouter = require('./userRegRouter')
const userLoginrouter = require('./userLogInRouter')
const userNamerouter = require('./userNameRouter')
const app = express();
const config = require('config');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/solarProjectData').then(() => console.log('Connected to MongoDB...')).catch(err => console.error('MongoDB Failed to Load'))

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Allows requests from this origin
    // Include Authorization in the list of allowed headers
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,User-Token");
    // Optionally, you may also want to allow methods if you're making requests other than GET/POST, like DELETE, PUT, etc.
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use('/api/items', itemRouter);
app.use('/api/itemDetails', itemDetailRouter);
app.use('/api/itemSubmission', itemSubmitlRouter);
app.use('/api/userRegister', userRegrouter);
app.use('/api/userLogin', userLoginrouter);
app.use('/api/userName', userNamerouter);
const server = app.listen(3000);