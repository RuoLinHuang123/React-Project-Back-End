const express = require('express');
const mongoose = require('mongoose')
const itemRouter = require('./item');
const itemDetailRouter = require('./itemDetail')
const app = express();

mongoose.connect('mongodb://localhost/solarProjectData').then(() => console.log('Connected to MongoDB...')).catch(err => console.error('Something Failed'))

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use('/api/items', itemRouter);
app.use('/api/itemDetails', itemDetailRouter);
const server = app.listen(3000);