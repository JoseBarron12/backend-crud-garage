const express = require('express');
const app = express();

process.loadEnvFile();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("HELLOOO");
})

app.listen(process.env.PORT, (err) => {
    if(err) {
        throw err
    }
    console.log(`LISTENING ON PORT ${process.env.PORT}`)
})