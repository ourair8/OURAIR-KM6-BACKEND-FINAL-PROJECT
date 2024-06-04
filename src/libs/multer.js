const multer = require("multer");
const path = require("path");

const filename = (req, file, callback) => {
  let fileName = Date.now() + path.extname(file.originalname);
  callback(null, fileName);
};

const generateStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, destination);
    },
    filename: filename,
  });
};

const generateFileFilter = (mimetypes) => {
  return (req, file, callback) => {
    if (mimetypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      let err = new Error(`Only ${mimetypes} are allowed to upload!`);
      callback(err, false);
    }
  };
};

module.exports = {
  image: multer({
    fileFilter: generateFileFilter(["image/png", "image/jpg", "image/jpeg"]),
    onError: (err, next) => {
      next(err);
    },
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
  }),
};
