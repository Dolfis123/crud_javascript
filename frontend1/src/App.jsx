import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Employee from "./Employee";
import Profile from "./Profile";
import Home from "./Home";
import AddEmployee from "./AddEmployee";
import EmployeeEdit from "./EmployeeEdit";
import Start from "./Start";
import EmployeeLogin from "./EmployeeLogin";
import EmployeeDetail from "./EmployeeDetail";
import AccountEmployee from "./AccountEmployee";

function App() {
  return (
    <div>
 
 <BrowserRouter>
        <Routes>
          <Route path="" element={<Start />}></Route>
          <Route path="/" element={<Dashboard />}>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/employee" element={<Employee />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/create" element={<AddEmployee />}></Route>
            <Route path="/employeeEdit/:id" element={<EmployeeEdit />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/account" element={<AccountEmployee />}></Route>
          <Route path="/employeelogin" element={<EmployeeLogin />}></Route>
          <Route
            path="/employeedetail/:id"
            element={<EmployeeDetail />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
