import axios from "axios";
import "./style.css";
import React, { useEffect, useState } from "react";

function Profile() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:7000/getAdmin")
      .then((res) => {
        if (res.data.Status === "Successful") {
          console.log(res.data.Result);
          setData(res.data.Result);
        } else {
          console.log("Error!")
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-center mt-2">
        <h3>Profile Admin</h3>
      </div>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {data.map((admin, index) => {
              return (
                <tr key={index}>
                  <td>{admin.nama}</td>
                  <td>{admin.email}</td>
                  <td>{admin.address}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Profile;
