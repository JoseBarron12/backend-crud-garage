const express = require('express');
const indexRouter = require('./src/routes');
const app = express();

process.loadEnvFile();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRouter)

app.listen(process.env.PORT, (err) => {
    if(err) {
        throw err
    }
    console.log(`LISTENING ON PORT ${process.env.PORT}`)
})