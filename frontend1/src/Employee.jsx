import axios from "axios";
import "./style.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Employee() {
  const [data, setData] = useState([]);



  useEffect(() => {
    axios
      .get("http://localhost:7000/getEmployee")
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data.Result);
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus karyawan ini?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:7000/delete/${id}`)
        .then((res) => {
          console.log(res.data.Status);
          if (res.data.Status === "Success") {
            window.location.reload(true);
          } else {
            alert("Error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-center mt-2 " >
        <h3>Employee List</h3>
      </div>
      <Link to="/create" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return (
                <tr key={index}>
                  <td>{employee.nama}</td>
                  <td>
                    {
                      <img
                        src={`http://localhost:7000/images/` + employee.image}
                        alt=""
                        className="empImg rounded-circle"
                        style={{ width: "55px", height: "60px" }}
                      />
                    }
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      className="btn btn-primary btn-sm m-2"
                    >
                      edit
                    </Link>
                    <button
                      onClick={(err, e) => handleDelete(employee.id)}
                      className="btn btn-sm btn-danger"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employee;
