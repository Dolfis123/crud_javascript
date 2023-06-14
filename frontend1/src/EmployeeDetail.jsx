import axios from "axios";
import "./table.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('http://localhost:7000/get/' + id)
      .then((res) => setEmployee(res.data.Result[0]))
      .catch((err) => console.log(err));
  });
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Apakah Anda yakin ingin keluar dari halaman ini?"
    );

    if (confirmLogout) {
      axios
        .get("http://localhost:7000/logout", { withCredentials: true })
        .then((res) => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div>
      <div className="d-flex justify-content-center flex-column align-items-center mt-3">

        <img
          src={
            employee?.image
              ? `http://localhost:7000/images/${employee.image}`
              : ""
          }
          alt=""
          className="empImg rounded-circle"
          style={{ width: "300px", height: "380px" }}
        />

        <div className="d-flex align-items-center flex-column mt-5">
          <table className="table m-10 table-custom">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Address</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{employee?.nama}</td>
                <td>{employee?.email}</td>
                <td>{employee?.address}</td>
                <td>{employee?.salary}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <br />
          <br />
          <button
            className="btn btn-primary me-2"
            onClick={(e) => navigate("/editdetail")}
            style={{ fontSize: "smaller" }}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ fontSize: "smaller" }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
