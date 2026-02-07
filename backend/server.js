const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();
const app = express();
const multer = require("multer");
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/developer"); // 👈 YOUR folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep original name
  }
});
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // 👈 YOUR folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep original name
  }
});

const upload = multer({ storage });
const upload2 = multer({ storage: storage2 });
app.post("/upload-dev-file", upload.single("file"), (req, res) => {
  res.json({
    message: "File stored successfully",
    fileName: req.file.filename,
    filePath: `uploads/developer/${req.file.filename}`
  });
});
app.post("/upload-dev-files", upload2.single("file"), (req, res) => {
  res.json({
    message: "File stored successfully",
    fileName: req.file.filename,
    filePath: `uploads/${req.file.filename}`
  });
});

app.get('/show', (req, res) => {
  db.query('SELECT * FROM tickets', (err, results) => {
    if (err) {
      console.error('Error fetching tickets:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } 
    res.json(results);
  });
});
app.get('/completed', (req, res) => {
  db.query('SELECT * FROM complete', (err, results) => {
    if (err) {
      console.error('Error fetching completed tickets:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } 
    res.json(results);
  });
});
app.post('/show-post',async(req,res)=>
{
    const id=req.body.id;
    const name=req.body.name;
    const client=req.body.client;
    const points=req.body.points;
    const problem=req.body.problem;
    const solution=req.body.solution;
    const q="insert into complete(id,name,client,points,problem,solution) values(?,?,?,?,?,?)";
    db.query(q,[id,name,client,points,problem,solution],(err,data)=>
    {
        if(err)
        {
            console.log("error occurred",err);
        }           
        else
        {
            res.send("data inserted");
        }                   
    });                 
});
app.post('/admin-home',async(req,res)=>
{
    const id=req.body.id;
    const name=req.body.name;
    const client=req.body.client;
    const points=req.body.points;
    const problem=req.body.problem;
    const priority=req.body.priority;
    const q="insert into tickets(id,name,client,points,problem,priority) values(?,?,?,?,?,?)";
    db.query(q,[id,name,client,points,problem,priority],(err,data)=>
    {
        if(err)
        {
            console.log("error occurred",err);
        }
        else
        {
            res.send("data inserted");
        } 
    });                 
});
app.delete('/show-post', async(req, res) => {
  const id=req.body.id;
  const deleteQuery = 'DELETE FROM tickets WHERE id = ?'; 
  db.query(deleteQuery, [id], (err, result) => {  
    if (err) { 
      console.error('Error deleting ticket:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }   
    res.json({ message: 'Ticket deleted successfully' });     
  });
});
app.put('/show-points', async(req, res) => {
  const pointsToAdd = req.body.points;
  const updateQuery = 'UPDATE points SET point = point + ? ';
  db.query(updateQuery, [pointsToAdd], (err, result) => {
    if (err) {
      console.error('Error updating points:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'Points updated successfully' });
  });
});

app.get('/show-points', (req, res) => {
  db.query('SELECT point FROM points', (err, results) => {
    if (err) {
      console.error('Error fetching points:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results.length > 0 ? results[0].point : 0);
  });
});
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], async (err, result) => {
    if (err) return res.json({ success: false, message: "DB Error" });

    if (result.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(insertQuery, [username, hashedPassword], (err, result) => {
      if (err) return res.json({ success: false, message: "Insert failed" });

      res.json({ success: true, message: "Registration successful" });
    });
  });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [username], async (err, result) => {
    if (err) return res.json({ success: false, message: "DB Error" });

    if (result.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ success: true, message: "Login success" });
    } else {
      res.json({ success: false, message: "Wrong password" });
    }
  });
});
app.get("/open-vscode", (req, res) => {
  exec("code", (error) => {
    if (error) {
      return res.status(500).send("VS Code not found");
    }
    res.send("VS Code opened");
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});