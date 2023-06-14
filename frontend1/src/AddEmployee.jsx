import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const [data, setData] = useState({
    nama: "",
    email: "",
    password: "",
    address: "",
    salary: "",
    image: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("nama", data.nama);
    formdata.append("email", data.email);
    formdata.append("password", data.password);
    formdata.append("address", data.address);
    formdata.append("salary", data.salary);
    formdata.append("image", data.image);

    axios
      .post("http://localhost:7000/create", formdata)
      .then((res) => {
        navigate("/employee");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex flex-column align-items-center pt-4 loginPage text-white">
      <h2>Add Employee</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div class="col-12">
          <label For="inputNama" className="form-label text-white">
            Nama
          </label>
          <input
            type="text"
            className="form-control"
            id="inputNama"
            placeholder="Enter Nama"
            autoComplete="off"
            onChange={(e) => setData({ ...data, nama: e.target.value })}
          />
        </div>
        <div class="col-12">
          <label For="inputEmail4" className="form-label text-white">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            placeholder="Enter Email"
            autoComplete="off"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div class="col-12">
          <label For="inputPassword4" className="form-label text-white">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            placeholder="Enter Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <div class="col-12">
          <label For="inputAddress4" className="form-label text-white">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="1234 Main"
            autoComplete="off"
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>
        <div class="col-12">
          <label For="inputSalary" className="form-label text-white">
            Salary
          </label>
          <input
            type="text"
            className="form-control"
            id="inputSalary"
            placeholder="Enter Salary"
            autoComplete="off"
            onChange={(e) => setData({ ...data, salary: e.target.value })}
          />
        </div>
        <div class="col-12 mb-3">
          <label class="form-label text-white" form="inputGroupFile01">
            Select Image
          </label>
          <input
            type="file"
            className="form-control"
            id="inputGroupFile01"
            onChange={(e) => setData({ ...data, image: e.target.files[0] })}
          />
        </div>
        <div class="col-15 text-white">
          <button type="submit" class="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddEmployee;
