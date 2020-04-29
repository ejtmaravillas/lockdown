const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser=require('body-parser');

//routes to items.js in routes folder
const items = require('./routes/api/items');

const port = process.env.port || 5000;

//Body
app.use(bodyParser.json());

//DB Config
const mongodb = require('./config/keys').mongoURI;
//Connect to MongoDB through mongoose
mongoose
    .connect(mongodb,{ useNewUrlParser:true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//GET Request expressjs
app.get('/', (req,res) => 
    res.send('Hello World'));

//use routes
app.use('/api/items',items);

app.listen(port, () => console.log(`Listening at port ${port}`));