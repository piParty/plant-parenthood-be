const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/pi-data-sessions', require('./routes/piDataSessions'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/pi-data-points', require('./routes/piDataPoints'));
app.use('/api/v1/plants', require('./routes/plants'));
app.use('/api/v1/user-aggregations', require('./routes/userAggregations'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
