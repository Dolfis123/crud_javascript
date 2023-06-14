const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "pendataan_karyawan",
    port: 3306, // Port MySQL yang digunakan
  };
  
  const con = mysql.createConnection(dbConfig);
  
  con.connect((err) => {
    if (err) {
      console.log("Error in connection:", err);
      return;
    }
    console.log("Connection successful");
  });

  export default con;
  