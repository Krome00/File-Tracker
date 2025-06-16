import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { FaEdit, FaTrash } from "react-icons/fa";
import OfficeForm from "./OfficeForm";
import { useStateContext } from "../context/ContextProvider";

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const { setNotification } = useStateContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const fetchOffices = () => {
    setLoading(true);
    axiosClient.get("/offices")
      .then(({ data }) => setOffices(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleEdit = (office) => {
    setSelectedOffice(office);
    setShowModal(true);
  };

  const handleDelete = (office) => {
    if (!confirm(`Delete office "${office.name}"?`)) return;
    axiosClient.delete(`/offices/${office.id}`).then(() => {
      setNotification("Office deleted.");
      fetchOffices();
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOffice(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Offices</h1>
        <button className="btn-add" onClick={() => setShowModal(true)}>+ Add Office</button>
      </div>

      <div className="card animated fadeInDown" style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>Actions</th>
              <th>Name</th>
              <th>Abbreviation</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center">Loading...</td></tr>
            ) : (
              offices.map((office) => (
                <tr key={office.id}>
                  <td>
                    <button onClick={() => handleEdit(office)} title="Edit" style={{ background: "none", border: "none" }}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(office)} title="Delete" style={{ background: "none", border: "none", marginLeft: "10px" }}>
                      <FaTrash />
                    </button>
                  </td>
                  <td>{office.name}</td>
                  <td>{office.abbreviation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={handleCloseModal} className="modal-close">X</button>
            <OfficeForm
              initialData={selectedOffice}
              onClose={handleCloseModal}
              onSaved={() => {
                handleCloseModal();
                fetchOffices();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
