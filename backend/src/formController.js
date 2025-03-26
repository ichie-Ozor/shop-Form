const db = require('./modals')
const moment = require('moment')
// const cloudinary = require("./util/cloudinary")
// const upload = require('./util/multer')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');

module.exports.createForm = async (req, res) => {
    const { name, shop_no, date, file, query_type = "insert", allocation = "" } = req.body
    console.log(req.body, "body", req.file)
    const uuid = uuidv4()

    // if (!req.file.path) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Error,. no file uploaded'
    //     })
    // }
    // const fileData = new FormData()
    // fileData.append('file', req.file.path)
    // fileData.append("upload_preset", "ichie-ozor")
    // fileData.append("cloud_name", "djh5ctpvn")

    // const data = await cloudinary.uploader.upload((req.file.path),
    //     function (err, result) {
    //         if (err) {
    //             return res.status(500).json({
    //                 success: false,
    //                 message: 'Error'
    //             })
    //         }
    //         return result
    //     })

    // console.log(data, "data in controller")
    // const image_url = data.secure_url

    db.sequelize.query(`CALL form(
        :query_type,
        :Id,
        :date,
        :name,
        :shop_no,
        :allocation,
        :file
        )`, {
        replacements: {
            query_type,
            Id: uuid,
            date: moment(date).format("YYYY-MM-DD"),
            name,
            shop_no,
            allocation: allocation,
            file: req.file.filename
        }
    }
    ).then((result) => {
        res.status(200).json({
            success: true,
            message: "Form formed successfully"
        })
    }).catch((err) => {
        console.log(err, "error", uuid)
        res.status(400).json({
            success: false,
            message: "Something went wrong while trying to save the form",

        })
    })
}

module.exports.getForm = async (req, res) => {
    const { id } = req.query

    db.sequelize.query(`SELECT * FROM form`,
        {
            replacements: { id },
            type: QueryTypes.SELECT
        }
    ).then((resp) => {
        res.status(200).json({
            success: true,
            resp
        })
    }).catch((err) => {
        res.status(500).json({
            success: false,
            message: "failed to get message",
            err
        })
    })
}