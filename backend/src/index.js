require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const models = require("./modals")
const path = require("path");


const app = express()

app.use(bodyParser.json())

let port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))

app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "src", "uploads"))
);

app.use(cors())

models.sequelize.sync().then(() => {
    console.log("Drop and Resync with {force: true}")
})

app.get("/", (req, res) => res.send("HEllo my world"))
require("./routes/form.js")(app)

app.all("/*", (req, res) => {
    res.status(404).send("This route does not exist")
})

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})