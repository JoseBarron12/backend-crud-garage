const express = require('express');
const indexRouter = require('./src/routes');
const passport = require("passport");
const cors = require('cors');

const app = express();

if(process.env.NODE_ENV != "production") {
    process.loadEnvFile();
}

app.use(express.urlencoded({extended: false}));

require("./src/config/passport")(passport);
app.use(passport.initialize())

app.use(cors());

app.use('/', indexRouter);

app.listen(process.env.PORT, (err) => {
    if(err) {
        throw err
    }
    console.log(`LISTENING ON PORT ${process.env.PORT}`)
})