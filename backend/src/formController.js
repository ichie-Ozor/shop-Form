const db = require('./modals')
const moment = require('moment')
// const cloudinary = require("./util/cloudinary")
// const upload = require('./util/multer')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');

 module.exports.createForm = async (req, res) => {
    try {
      const { 
        name, 
        shop_no, 
        date, 
        phoneNumber,
        address,
        natureOfBusiness,
        allocation,
        query_type = "insert" 
      } = req.body;
      
      console.log('Request body:', req.body);
      console.log('Uploaded files:', req.files);
      
      // Validate required fields
      if (!name || !shop_no || !date || !phoneNumber || !address || !natureOfBusiness || !allocation) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }
  
      // Generate unique ID
      const uuid = uuidv4();
      
      // Get code from number generator
      const [code] = await db.sequelize.query(`SELECT * FROM number_generator WHERE prefix="KN"`);
      if (!code || code.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Error generating user ID'
        });
      }
      
      const { prefix, code_no } = code[0];
      const codeNo = code_no + 1;
      const userID = `${prefix}-MARM-${moment().format("YY")}-${codeNo}`;
      
      console.log('Generated userID:', userID);
  
      // Handle file uploads
      const passportFile = req.files?.passport ? req.files.passport[0].filename : null;
      const allocationLetterFile = req.files?.allocationLetter ? req.files.allocationLetter[0].filename : null;
      const agreementLetterFile = req.files?.agreementLetter ? req.files.agreementLetter[0].filename : null;
  
      // Update your stored procedure call to include all fields
      await db.sequelize.query(`CALL create_shop_form(
        :query_type,
        :Id,
        :date,
        :name,
        :phoneNumber,
        :address,
        :natureOfBusiness,
        :shop_no,
        :allocation,
        :passport,
        :allocationLetter,
        :agreementLetter
      )`, {
        replacements: {
          query_type,
          Id: userID,
          date: moment(date).format("YYYY-MM-DD"),
          name,
          phoneNumber,
          address,
          natureOfBusiness,
          shop_no,
          allocation,
          passport: passportFile,
          allocationLetter: allocationLetterFile,
          agreementLetter: agreementLetterFile
        }
      });
  
      // Update the code number
      await db.sequelize.query(`UPDATE number_generator SET code_no=? WHERE prefix="KN"`, {
        replacements: [codeNo]
      });
  
      res.status(200).json({
        success: true,
        message: "Shop form submitted successfully",
        data: {
          userID,
          submittedAt: new Date().toISOString()
        }
      });
  
    } catch (err) {
      console.error('Error in createForm:', err);
      res.status(500).json({
        success: false,
        message: "Something went wrong while trying to save the form",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

module.exports.getForm = async (req, res) => {
    const { id } = req.query

    db.sequelize.query(`SELECT * FROM shop_applications`,
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