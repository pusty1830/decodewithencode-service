// const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
// require("dotenv").config();
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// const AWS_REGION = process.env.AWS_REGION;
// const s3client = new S3Client({
//   region: AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
//   },
// });

// module.exports = s3client;

// async function getObject(key) {
//   const command = new GetObjectCommand({
//     Bucket: "lms-ap-bucket",
//     Key: key,
//   });
//   const url = await getSignedUrl(s3client, command);
//   return url;
// }
// console.log("url :", getObject("IMG-20240218-WA0002.jpg"));

const { S3Client } = require("@aws-sdk/client-s3");

const config = {
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACESS_KEY,
    secretAccessKey: process.env.SECRET_ACESS_KEY,
  },
};

const s3 = new S3Client(config);

module.exports = s3;
