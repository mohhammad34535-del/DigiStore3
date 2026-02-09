const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shop_db"
});

app.post("/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  db.query(
    "INSERT INTO users (email,password) VALUES (?,?)",
    [req.body.email, hash],
    ()=>res.send("ok")
  );
});

app.post("/login",(req,res)=>{
  db.query(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],
    async (e,r)=>{
      if(!r[0]) return res.send("fail");
      const ok = await bcrypt.compare(req.body.password,r[0].password);
      res.send(ok ? "success" : "fail");
    }
  );
});

app.listen(3000);
