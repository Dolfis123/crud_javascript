import express from require('express').Router();
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import {con} from '../models/Connection';
const router = express();


const generateToken = (id) => {
  return jwt.sign({ id }, "jwt-secret-key", { expiresIn: "1d" });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Token Wrong" });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};


router.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ Status: "Successful"});
});

router.get('/adminCount', (req, res) => {
  const sqlQuery = "select count(id) as admin from users";
  con.query(sqlQuery, (err, result)=> {
    if(err) return res.json({Error: "error in running query"});
    return res.json(result);
  })
})


router.get('/employeeCount', (req, res)=>{
  const sqlQuery = "select count(id) as employee from employee";
  con.query(sqlQuery, (err, result)=> {
    if(err) return res.json({Error: "error in running query"});
    return res.json(result);
  })
})


router.get('/salary', (req, res)=>{
  const sqlQuery = "select sum(salary) as sumOfSalary from employee";
  con.query(sqlQuery, (err, result)=> {
    if(err) return res.json({Error: "error in running query"});
    return res.json(result);
  })
})


router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sqlQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
  con.query(sqlQuery, [email, password], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ Status: "Error", Error: "Error in server" });
    if (result.length === 0) {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
    const user = result[0];

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log("Error in bcrypt:", err);
        return res
          .status(500)
          .json({ Status: "Error", Error: "Error in server" });
      }

      if (hashedPassword) {
        const token = jwt.sign({ userId: user.id }, "secretKey");
        return res.json({ Status: "Success", Token: token });
      } else {
        return res.json({ Status: "Error", Error: "Wrong Email or Password" });
      }
    });
  });
});

router.post('/employeelogin', (req, res) => {
  const sqlQuery = "select * from employee where email = ? ";
  con.query(sqlQuery, [req.body.email], (err, result) => {
    if(err) return res.json({Status: "Error", Error: "Error in running query"});
    if(result.length > 0){
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if(err) return res.json({Error: "Password error"});
        const id = result[0].id;
        const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
        res.cookie('token', token);
        return res.json({Status: "Success", id: result[0].id});
      });
    } else {
      return res.json({Status: "Error", Error: "Wrong Email or Password!"});
    }
  });
});


//method get logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

//Untuk Create Employee
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.get("/getEmployee", (req, res) => {
  const sqlQuery = " SELECT * FROM employee";
  con.query(sqlQuery, (err, result) => {
    if (err) return res.json({ Error: "Get Employee error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

router.post("/create", upload.single("image"), (req, res) => {
  const sqlQuery =
    "INSERT INTO employee (nama, email, password, address, salary, image) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });
    const values = [
      req.body.nama,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
    ];
    con.query(sqlQuery, [values], (err, result) => {
      if (err) return res.json({ Error: "Inside singup query" });
      return res.json({ Status: "Successful" });
    });
  });
});

router.get("/get/:id", (req, res) => {
  const id = req.params.id;

  const sqlQuery = "SELECT * FROM employee WHERE id = ?";
  con.query(sqlQuery, [id], (err, result) => {
    if (err) return res.json({ Error: "view singup query" });
    return res.json({ Status: "Successful", Result: result });
  });
});
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery =
    "update employee set nama = ?, email = ?, address = ?, salary = ? where id = ?";
  con.query(
    sqlQuery,
    [req.body.nama, req.body.email, req.body.address, req.body.salary, id],
    (err, result) => {
      if (err) return res.json({ Error: "update employee error in sql" });
      return res.json({ Status: "Successful" });
    }
  );
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery = "DELETE FROM employee WHERE id = ?";
  con.query(sqlQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error deleting employee", err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Employee not found" });
    }
    return res.json({ Status: "Successful" });
  });
});
  
  module.exports = router