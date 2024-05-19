const express = require('express');
const cors = require('cors');
const authorizeMiddleware = require('./middleware/authorizeMiddleware');
const Router = require('./routes');
const app = express();

//Bodyparser (Express from version 4.16 to present)
app.use(express.urlencoded({
    extended: true
}));

//Connect to Local Client
app.use(cors());

//Middleware
app.use(authorizeMiddleware);

//Router
Router(app);

app.listen(5000);