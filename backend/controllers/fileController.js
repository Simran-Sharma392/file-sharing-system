const db = require("../config/db");
const {nanoid}=require("nanoid");
const createFile = (req, res) => {
  const { description, category, expiry } = req.body;
  const file_name = req.file.filename;
  const sender_id = req.user.id;
  const file_key=nanoid(10);
  const sql = `
    INSERT INTO files (sender_id, file_name, description, category, expiry, file_key)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [sender_id, file_name, description, category, expiry, file_key],
    (err) => {
      if (err)
        return res.status(500).json({ error: err.message });
      const file_link=`http://localhost:5000/api/file/${file_key}`;
      res.status(201).json({
        message: "File uploaded successfully", file_key, file_link,
      });
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

const getFileByKey=(req,res)=>{
  const{key}=req.params;
  const sql=`SELECT * from files WHERE file_key=?`;
  db.query(sql, [key], (err, results)=>{
    if(err) return res.status(500).json({
      error: err.message,
    });
    if(results.lenght === 0){
      return res.status(404).json({
        message:"File not found",
      });
    }
    const file=results[0];
    if(file.status != "ACTIVE"){
      return res.status(403).json({
        message:`File is ${file.status.toLowerCase()}`
      });
    }
    const now=new Date();
    const expiry=new Date(file.expiry);
    if(now>expiry){
      const updateSql=`UPDATE files set status='EXPIRED' where id=?`;
      db.query(updateSql, [file.id]);
      return res.status(403).json({
        message:"File has expired",
      });
    }
    res.json(file);
  });
};

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

module.exports = { createFile, getAllFiles, getFileByKey, getMyFiles };
