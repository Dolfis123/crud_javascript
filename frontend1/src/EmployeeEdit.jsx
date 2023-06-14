import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeEdit() {
  const [data, setData] = useState({
    nama: "",
    email: "",
    address: "",
    salary: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:7000/get/${id}`)
      .then((res) => {
        setData({
          ...data,
          nama: res.data.Result[0].nama,
          email: res.data.Result[0].email,
          address: res.data.Result[0].address,
          salary: res.data.Result[0].salary,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:7000/update/${id}`, {
        nama: data.nama,
        email: data.email,
        address: data.address,
        salary: data.salary,
      })
      .then((res) => {
        navigate("/employee");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Employee</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div class="col-12">
          <label For="inputNama" className="form-label">
            Nama
          </label>
          <input
            type="text"
            className="form-control"
            id="inputNama"
            placeholder="Enter Nama"
            autoComplete="off"
            onChange={(e) => setData({ ...data, nama: e.target.value })}
            value={data.nama}
          />
        </div>
        <div class="col-12">
          <label For="inputEmail4" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            placeholder="Enter Email"
            autoComplete="off"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
        </div>
        <div class="col-12">
          <label For="inputAddress4" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="1234 Main"
            autoComplete="off"
            onChange={(e) => setData({ ...data, address: e.target.value })}
            value={data.address}
          />
        </div>
        <div class="col-12">
          <label For="inputSalary" className="form-label">
            Salary
          </label>
          <input
            type="text"
            className="form-control"
            id="inputSalary"
            placeholder="Enter Salary"
            autoComplete="off"
            onChange={(e) => setData({ ...data, salary: e.target.value })}
            value={data.salary}
          />
        </div>
        <div class="col-15 d-flex justify-content-between">
          <button type="submit" className="btn btn-primary order-1">
            Update
          </button>
          <button
            type="submit"
            className="btn btn-success rounded btn-center order-2"
            onClick={(e) => navigate("/employee")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
export default EmployeeEdit;
