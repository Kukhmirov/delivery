const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'filestorage');
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`)
  }
});

const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

module.exports = multer({
  storage, fileFilter
});
