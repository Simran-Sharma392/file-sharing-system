const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/auth");
const { createFile, getAllFiles, getMyFiles } = require("../controllers/fileController");
/* Sender only */
router.post(
  "/files",
  verifyToken,
  checkRole(["sender"]),
  createFile
);

/* Receiver only */
router.get(
  "/files",
  verifyToken,
  checkRole(["receiver"]),
  getAllFiles
);

/* Sender dashboard */
router.get("/my-files", verifyToken, checkRole(["sender"]), getMyFiles);
module.exports = router;
