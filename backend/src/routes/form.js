const { createForm, getForm } = require("../formController")
const upload = require('../util/multer')

module.exports = (app) => {
    app.post("/form", upload.single('file'), createForm)
    app.get("/form", getForm)
}