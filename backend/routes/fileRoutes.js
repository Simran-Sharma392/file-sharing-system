const express = require("express");
const router = express.Router();

const { verifyToken, checkRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createFile,
  getAllFiles,
  getMyFiles,
} = require("../controllers/fileController");

/* Sender only - upload file */
router.post(
  "/files",
  verifyToken,
  checkRole(["sender"]),
  upload.single("file"),
  createFile
);

/* Receiver only - view all files */
router.get(
  "/files",
  verifyToken,
  checkRole(["receiver"]),
  getAllFiles
);

/* Sender dashboard - view own uploads */
router.get(
  "/my-files",
  verifyToken,
  checkRole(["sender"]),
  getMyFiles
);

module.exports = router;