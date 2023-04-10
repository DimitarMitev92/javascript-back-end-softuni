const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const { PORT } = require('./config/env.js');
const routes = require('./routes.js');
const { dbInit } = require('./config/initDb.js');
const { auth } = require('./middlewares/authMiddleware.js');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware.js');

const app = express();

app.engine('hbs', hbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(auth);
app.use(routes);
app.use(errorHandler);

dbInit();
app.listen(PORT, () => console.log(`Server is listening on ${PORT} ...`));