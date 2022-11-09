const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

// app.get("/", (req, res) => {
//     const content = fs.readFileSync(path.join(__dirname, 'static', 'index.html'), 'utf8');
//     res.send(content);
// })

app.get("/", (req, res, next) => {
    console.log("Primeiro get")
    next()
})

app.get("/", (req, res, next) => {
    console.log("Segundo get")
    next()
})

app.use("/", express.static(path.join(__dirname, "static")));

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000")
});