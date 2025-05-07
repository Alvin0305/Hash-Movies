import React, { useState, useEffect, useMemo } from "react";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";

const Platforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  const sortedPlatforms = useMemo(() => {
    let sortablePlatforms = [...platforms];
    if (sortConfig.key !== null) {
      sortablePlatforms.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortablePlatforms;
  }, [platforms, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await api.fetchPlatforms();
        console.log(response.data.platforms);
        setPlatforms(response.data.platforms);
      } catch (err) {
        console.log("platform error: ", err.message);
      }
    };
    fetchPlatforms();
  }, []);

  const deletePlatform = (id) => {
    const deletePlat = async () => {
      try {
        const response = await api.deletePlatform(id);
        console.log(response.data);
        setPlatforms(platforms.filter((platform) => platform._id !== id));
      } catch (err) {
        console.log("delete genre error: ", err.message);
      }
    };

    deletePlat();
  };

  return (
    <div className="admin-table-div">
      <table className="genre-table">
        <thead>
          <tr className="table-row">
            <th className="table-head">#</th>
            <th className="table-head">ID</th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("name")}
            >
              Name
              {sortConfig.key === "name"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("link")}
            >
              Link
              {sortConfig.key === "link"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlatforms.map((platform, index) => (
            <tr key={platform._id} className="table-row">
              <td className="table-data">{index + 1}</td>
              <td className="table-data">{platform._id}</td>
              <td className="table-data">{platform.name}</td>
              <td className="table-data">{platform.link}</td>
              <td className="table-data">
                <button
                  className="table-button table-update-button"
                  onClick={() =>
                    navigate("/admin/platform/update", {
                      state: { platform: platform },
                    })
                  }
                >
                  Update
                </button>
              </td>
              <td className="table-data">
                <button
                  className="table-button table-delete-button"
                  onClick={() => deletePlatform(platform._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="admin-add-button"
        onClick={(e) => {
          e.preventDefault();
          navigate("/admin/platform/add");
        }}
      >
        +
      </button>
    </div>
  );
};

export default Platforms;
