const db = require("../config/db");
const {nanoid}=require("nanoid");
const bcrypt = require("bcrypt");

//File creation - storing file metadata
const createFile = (req, res) => {
  const { description, category, expiry , password} = req.body;
  const file_name = req.file.filename;
  const sender_id = req.user.id;
  const file_key=nanoid(10);
  let password_hash=null;
  if(password){
    password_hash=bcrypt.hashSync(password,10);
  }
  const sql = `
    INSERT INTO files (sender_id, file_name, description, category, expiry, file_key, password_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [sender_id, file_name, description, category, expiry, file_key, password_hash],
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

//Get all file metadata of a sender
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

//Get file metadata based on file_key
const getFileByKey=(req,res)=>{

  const{key}=req.params;
  const sql=`SELECT * from files WHERE file_key=?`;
  db.query(sql, [key], (err, results)=>{
    if(err) return res.status(500).json({
      error: err.message,
    });
    if(results.length === 0){
      return res.status(404).json({
        message:"File not found",
      });
    }
    const file=results[0];

    const password = req.body?.password;
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
    if(file.password_hash){
      if(!password){
        return res.status(401).json({
          message:"Password required",
        });
      }
      const isMatch=bcrypt.compareSync(password, file.password_hash);
      if(!isMatch){
        return res.status(401).json({
          message:"Incorrect file password",
        });
      }
    }
    const preview_url=`http://localhost:5000/uploads/${file.file_name}`;
    res.json({
      id: file.id,
      file_name: file.file_name,
      description: file.description,
      category: file.category,
      expiry: file.expiry,
      status: file.status,
      preview_url
    });
  });
};

//Get file metadata of a particular sender
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

//for sender - to revoke uploaded files
const revokeFile=(req,res)=>{
  const {id}=req.params;
  const sender_id=req.user.id;
  const sql=`
  UPDATE files set status='REVOKED' where id=? and sender_id=?
  `;
  db.query(sql, [id, sender_id], (err, result)=>{
    if(err){
      return res.status(500).json({
        error: err.message
      });
    }
    res.json({
      message:"File revoked successfully"
    });
  });
}
module.exports = { createFile, getAllFiles, getFileByKey, getMyFiles, revokeFile };
