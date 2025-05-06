import React, { useEffect, useMemo, useState } from "react";
import * as api from "../../../api";
import "../home/home.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableUsers;
  }, [users, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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
          <tr className="table-row">
            <th className="table-head">#</th>
            <th className="table-head">ID</th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("username")}
            >
              UserName{" "}
              {sortConfig.key === "username"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("email")}
            >
              Email{" "}
              {sortConfig.key === "email"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("gender")}
            >
              Gender{" "}
              {sortConfig.key === "gender"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("createdAt")}
            >
              Created At{" "}
              {sortConfig.key === "createdAt"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("updatedAt")}
            >
              Last Update{" "}
              {sortConfig.key === "updatedAt"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user._id} className="table-row">
              <td className="table-data">{index + 1}</td>
              <td className="table-data">{user._id}</td>
              <td className="table-data">{user.username}</td>
              <td className="table-data">{user.email}</td>
              <td className="table-data">{user.gender}</td>
              <td className="table-data">{user.createdAt.split("T")[0]}</td>
              <td className="table-data">{user.updatedAt.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
