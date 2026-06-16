const multer = require("multer");
const path = require("path");

// Decide where and how files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

// Allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".zip",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, PNG, JPG, JPEG and ZIP files are allowed."
      )
    );
  }
};

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;