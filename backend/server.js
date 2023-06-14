import express, { response } from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
//import argon2 from "argon2";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "pendataan_karyawan",
  port: 3306,
};

const con = mysql.createConnection(dbConfig);
con.connect((err) => {
  if (err) {
    console.log("Error in connection:", err);
    return;
  }
  console.log("Connection successful");
});

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

app.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ Status: "Successful" });
});

app.get("/dashboardemployee", verifyUser, (req, res) => {
  return res.json({ Status: "Successful" });
});

app.get("/adminCount", (req, res) => {
  const sqlQuery = "select count(id) as admin from users";
  con.query(sqlQuery, (err, result) => {
    if (err) return res.json({ Error: "error in running query" });
    return res.json(result);
  });
});

app.get("/employeeCount", (req, res) => {
  const sqlQuery = "select count(id) as employee from employee";
  con.query(sqlQuery, (err, result) => {
    if (err) return res.json({ Error: "error in running query" });
    return res.json(result);
  });
});

app.get("/salary", (req, res) => {
  const sqlQuery = "select sum(salary) as sumOfSalary from employee";
  con.query(sqlQuery, (err, result) => {
    if (err) return res.json({ Error: "error in running query" });
    return res.json(result);
  });
});

app.post("/login", (req, res) => {
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
app.post("/employeelogin", (req, res) => {
  const sqlQuery = "SELECT * FROM employee WHERE email = ?";
  con.query(sqlQuery, [req.body.email], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password error" });
          const token = jwt.sign(
            { role: "employee", id: result[0].id },
            "jwt-secret-key",
            { expiresIn: "1d" }
            
          );
          res.cookie("token", token);
          return res.json({ Status: "Success" });
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password!" });
    }
  });
});

// const { email, password } = req.body;
// const sqlQuery = "SELECT * FROM employee WHERE email = ? AND password = ?";
// con.query(sqlQuery, [email, password], (err, result) => {
//   if (err) {
//     return res.json({ Status: "Error", Error: "Error in running query" });
//   }
//   if (result.length === 0) {
//     const { id, password: hashedPassword } = result[0];
//     bcrypt.compare(password, hashedPassword, (err, response) => {
//       if (err) {
//         return res.json({ Error: "Password error" });
//       }
//       if (response) {
//         const token = jwt.sign({ role: "employee", id }, "jwt-secret-key", {
//           expiresIn: "1d",
//         });
//         res.cookie("token", token);
//         return res.json({ Status: "Success", id });
//       } else {
//         return res.json({
//           Status: "Error",
//           Error: "Wrong Email or Password!",
//         });
//       }
//     });
//   } else {
//     return res.json({ Status: "Error", Error: "Wrong Email or Password!" });
//   }
// });

// app.get('/employee/:id', (req, res)=>{
//   const id = req.params.id;
//   const sqlQuery = "SELECT * FROM employee WHERE id = ?";
//   con.query(sqlQuery, [id], (err, result) => {
//     if (err) return res.json({ Error: "view singup query" });
//     return res.json({ Status: "Successful", Result: result });
//   });
// })

//method get logout
app.get("/logout", (req, res) => {
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

app.get("/getAdmin", (req, res) => {
  const sqlQuery = "SELECT * FROM users";
  con.query(sqlQuery, (err, result) => {
    if (err) return res.json({ Error: "Error in query" });
    return res.json({ Status: "Successful", Result: result });
  });
});

app.get("/getEmployee", (req, res) => {
  const sqlQuery = " SELECT * FROM employee";
  con.query(sqlQuery, (err, result) => {
    if (err) return res.json({ Error: "Get Employee error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.post("/create", upload.single("image"), (req, res) => {
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

app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery = "SELECT * FROM employee WHERE id = ?";
  con.query(sqlQuery, [id], (err, result) => {
    if (err) return res.json({ Error: "Get Employee Error" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.put("/update/:id", (req, res) => {
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

// app.get('/employee/:id', (req, res) => {
//   const id = req.params.id;
//   const sqlQuery = "SELECT * FROM employee WHERE id = ?";
//   con.query(sqlQuery, [id], (err, result) => {
//     if (err) return res.json({ Error: "Get Employee Error" });
//     return res.json({ Status: "Success", Result: result });
//   });
// })

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery = "DELETE FROM employee WHERE id = ?";
  con.query(sqlQuery, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Status: "Error", Error: "Error deleting employee", err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: "Error", Error: "Employee not found" });
    }
    return res.json({ Status: "Success" });
  });
});

app.listen(7000, () => {
  console.log("Server up and running");
});
