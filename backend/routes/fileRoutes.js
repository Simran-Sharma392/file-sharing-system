const express = require("express");
const router = express.Router();

const { verifyToken, checkRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createFile,
  getAllFiles,
  getMyFiles,
  getFileByKey,
  revokeFile,
  downloadFile,
} = require("../controllers/fileController");

//Sender only - upload file 
router.post(
  "/files",
  verifyToken,
  checkRole(["sender"]),
  upload.single("file"),
  createFile
);

//Receiver only - view all files 
router.get(
  "/files",
  verifyToken,
  checkRole(["receiver"]),
  getAllFiles
);

//Sender dashboard - view own uploads 
router.get(
  "/my-files",
  verifyToken,
  checkRole(["sender"]),
  getMyFiles
);

//Sender - to revoke files
router.patch(
  "/files/:id/revoke",
  verifyToken,
  checkRole(["sender"]),
  revokeFile
);

//Sender and Receiver - view files from file_link
router.get(
  "/file/:key",
  getFileByKey
);

//receiver - download files
router.get(
  "/download/:key",
  downloadFile
);

module.exports = router;