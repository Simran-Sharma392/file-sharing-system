const express = require("express");
const cors = require("cors");

const app = express();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const { verifyToken, checkRole } = require("./middleware/auth");
const fileRoutes = require("./routes/fileRoutes");
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", fileRoutes);
app.get("/test", (req, res) => {
  res.send("Server working!");
});

app.get(
  "/sender-dashboard",
  verifyToken,
  checkRole(["sender"]),
  (req, res) => {
    res.json({ message: "Welcome Sender" });
  }
);

app.get(
  "/receiver-dashboard",
  verifyToken,
  checkRole(["receiver"]),
  (req, res) => {
    res.json({ message: "Welcome Receiver" });
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
