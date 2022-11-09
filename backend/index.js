const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

app.use("/static", express.static(path.join(__dirname, "static")));


// app.get("/", (req, res) => {
//     const content = fs.readFileSync(path.join(__dirname, 'static', 'index.html'), 'utf8');
//     res.send(content);
// })

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000")
});