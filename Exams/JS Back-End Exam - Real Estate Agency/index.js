const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const routes = require('./routes.js');
const { authentication } = require('./middlewares/authMiddleware.js');

const app = express();

app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authentication);
app.use(routes);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/realEstate', () => console.log('DB is running'));

app.listen(3000, () => console.log('Server is listening on port 3000 ...'));