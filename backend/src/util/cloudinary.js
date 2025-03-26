const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

// cloudinary.config({
//     cloud_name: "djh5ctpvn",
//     api_key: "UfTyHePM628L5Afgy4IRvBjNhqY",
//     api_secret: "qwerty123456"
// })

module.exports = cloudinary

// const cloudinary = require('cloudinary').v2;
// const streamifier = require('streamifier');
// cloudinary.config({
//     cloud_name: 'ddls0gpui',
//     api_key: '272885796563594',
//     api_secret: '5rsp5tvkBSNCNyFN6s2KINYfYxs'
// });
// module.exports = cloudinary;



// async function uploadToCloudinary(buffer) {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         });
//         streamifier.createReadStream(buffer).pipe(uploadStream);
//     });
// }

// module.exports = uploadToCloudinary;