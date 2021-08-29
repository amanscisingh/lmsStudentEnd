const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// using body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// using dotenv
require('dotenv').config({ path: './config/.env' })
const URL = process.env.MONGODB_URI.toString();
const PORT = process.env.PORT;

// setting templating engineapp.engine('.hbs', exphbs({helpers:{ formatDate, indexing }, defaultLayout: 'main', extname: '.hbs'}));
function parseToString(input) {
    return input.toString();
};


app.engine('.hbs', exphbs({helpers:{ parseToString }, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// setting up public folder
const __dirname__ = path.resolve();
app.use(express.static(path.join(__dirname__, 'public')));

// connecting to db and starting the server
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(PORT, console.log(`Server running on port ${PORT} and DB is connected as Well!!! `))
}).catch((err)=>{
    console.log('Error: ', err.message);
})

// using cokie parser
app.use(cookieParser());

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/studentDashboard', require('./routes/studentDashboard'));
app.use('/api', require('./routes/api'));
