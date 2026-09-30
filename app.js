const express = require('express');
const indexRouter = require('./src/routes');
const passport = require("passport");

const app = express();

process.loadEnvFile();

app.use(express.urlencoded({extended: true}));

require("./src/config/passport")(passport);
app.use(passport.initialize())

app.use('/', indexRouter);

app.listen(process.env.PORT, (err) => {
    if(err) {
        throw err
    }
    console.log(`LISTENING ON PORT ${process.env.PORT}`)
})