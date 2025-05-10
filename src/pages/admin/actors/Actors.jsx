import React, { useState, useEffect, useMemo } from "react";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";

const Actors = () => {
  const [actors, setActors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  const sortedActors = useMemo(() => {
    let sortableActors = [...actors];
    if (sortConfig.key !== null) {
      sortableActors.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    console.log("sortables: ", sortableActors);

    return sortableActors;
  }, [actors, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await api.fetchActors();
        console.log(response.data);
        setActors(response.data);
        console.log(response.data[0].name);
        console.log(response.data[0].debutMovie);
        console.log(response.data[0].debutMovie.title);
      } catch (err) {
        console.log("actor fetch error: ", err.message);
      }
    };
    fetchActors();
  }, []);

  const deleteActor = (id) => {
    const deleteAct = async () => {
      try {
        const response = await api.deleteActor(id);
        console.log(response.data);
        setActors(actors.filter((actor) => actor._id !== id));
      } catch (err) {
        console.log("delete actor error: ", err.message);
      }
    };

    deleteAct();
  };

  return (
    <div className="admin-table-div">
      <h1 className="home-page-sub-heading">ACTORS</h1>
      <table className="general-table">
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
              onClick={() => handleSort("debutMovie")}
            >
              Debut Movie
              {sortConfig.key === "debutMovie"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedActors.map((actor, index) => (
            <tr key={actor._id} className="table-row">
              <td className="table-data">{index + 1}</td>
              <td className="table-data">{actor._id}</td>
              <td className="table-data">{actor.name}</td>
              <td className="table-data">{actor.debutMovie.title}</td>
              <td className="table-data">
                <button
                  className="table-button table-update-button"
                  onClick={() =>
                    navigate("/admin/actor/update", { state: { actor: actor } })
                  }
                >
                  Update
                </button>
              </td>
              <td className="table-data">
                <button
                  className="table-button table-delete-button"
                    onClick={() => deleteActor(actor._id)}
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
          navigate("/admin/actor/add");
        }}
      >
        +
      </button>
    </div>
  );
};

export default Actors;
