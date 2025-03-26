// const multer = require('multer')

// const storage = multer.diskStorage({
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

// module.exports = upload


const path = require('path')
const multer = require('multer')
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../uploads")
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        console.log(file.mimetype, "file type")
        if (
            file.mimetype == "application/pdf" ||
            file.mimetype == "application/msword" ||
            file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/svg+xml" ||
            file.mimetype == "image/jpeg"
        ) {
            callback(null, true)
        } else {
            console.log("Ony pdf, doc and docx are supported!")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 4
    }
})

module.exports = upload