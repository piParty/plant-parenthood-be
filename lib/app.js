const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(require('cookie-parser')());

app.use(cookieParser());
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/piDataSessions', require('./routes/piDataSessions'));

app.use('/api/v1/dataPoints', require('./routes/piDataPoints'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
