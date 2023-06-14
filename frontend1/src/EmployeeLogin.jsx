import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:7000/employeelogin", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          const id = res.data.id;
          console.log("Login successful");
          navigate("/employeedetail/" + id);
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-danger">{error && error}</div>
        <h2>Login Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Log in
          </button>
          <p>You agree to our terms and policies</p>
          <br />
          <button
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration"
            onClick={(e) => navigate("/account")}
          >
            Create Account
          </button>
        </form>
        <br />
        <br />
        <div>
          <button
            type="submit"
            className="btn btn-success w-10 rounded"
            onClick={(e) => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;
