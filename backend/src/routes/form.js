const { createForm, getForm } = require("../formController")
const upload = require('../util/multer')

module.exports = (app) => {
    app.post("/form", upload.fields([
        { name: 'passport', maxCount: 1 },
        { name: 'allocationLetter', maxCount: 1 },
        { name: 'agreementLetter', maxCount: 1 }
      ]), createForm)
    app.get("/form", getForm)
}