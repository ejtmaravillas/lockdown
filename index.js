const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 

//routes to items.js in routes folder
const items = require('./routes/api/items');

//routes to users.js in routes folder
const users = require('./routes/api/users');

const port = process.env.port || 5000;

//Cookie Parsers
app.use(cookieParser());
//Body
app.use(bodyParser.urlencoded({ extended: true }));
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

//use routes to get delete update post items api
app.use('/api/items',items);

//use routes to get delete post users api
app.use('/api/users',users);

app.listen(port, () => console.log(`Listening at port ${port}`));