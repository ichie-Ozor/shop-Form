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


// app.use(
//     "/uploads",
//     express.static(path.join(__dirname, "..", "src", "uploads"))
 
    
// );
app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, "..", "src", "uploads")));

app.use(cors())


app.use(cors({
    origin: '*', // During development, you can use '*'. For production, specify your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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