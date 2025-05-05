import React, { useEffect, useState } from "react";
import * as api from "../../../../api";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.fetchAllUsers();
        const data = response.data.filter((data) => data.role !== "admin");
        console.log(data);
        setUsers(data);
      } catch (err) {
        console.log("users error: ", err.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Sl.No.</th>
            <th>ID</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Created At</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.createdAt.split("T")[0]}</td>
              <td>{user.updatedAt.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
