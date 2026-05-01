const db = require("../config/db");

const createFile = (req, res) => {
  const { file_name, description, category, expiry } = req.body;
  const sender_id = req.user.id;

  const sql = `
    INSERT INTO files (sender_id, file_name, description, category, expiry)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [sender_id, file_name, description, category, expiry],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: "File metadata created" });
    }
  );
};

const getAllFiles = (req, res) => {
  const sql = `
    SELECT files.id, file_name, description, category, expiry, users.name AS sender
    FROM files
    JOIN users ON files.sender_id = users.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

module.exports = { createFile, getAllFiles };
const getMyFiles = (req, res) => {
  const sender_id = req.user.id;

  const sql = `
    SELECT * FROM files WHERE sender_id = ?
  `;

  db.query(sql, [sender_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};
module.exports = { createFile, getAllFiles, getMyFiles };