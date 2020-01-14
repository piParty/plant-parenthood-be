const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());

app.use(cookieParser());
app.use('/api/v1/dataPoints', require('./routes/piDataPoints'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
