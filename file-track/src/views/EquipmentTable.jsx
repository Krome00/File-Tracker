import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import EquipmentTableForm from "./EquipmentTableForm";
import { FaEdit, FaTrash, FaHistory } from 'react-icons/fa';
import Pagination from '../components/Pagination';
// import dummyEquipments from "../dummy/dummyData.js";
import SearchAndFilter from "../components/SearchAndFilter";

export default function EquipmentTable() {
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchEquipments = () => {
    setLoading(true);
  axiosClient.get("/equipments")
    .then(({ data }) => {
      setEquipments(data);
      setLoading(false);

      // 🔥 Check if currentPage is now too high, adjust if necessary
      const filtered = data.filter(eq =>
        Object.values(eq).some(
          value =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (selectedFilter === "" || eq.name === selectedFilter)
      );
      const newTotalPages = Math.ceil(filtered.length / pageSize);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    })
    .catch(() => setLoading(false));
    // setTimeout(() => {
    //   setEquipments(dummyEquipments);
    //   setLoading(false);
    // }, 500);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleAddNew = () => {
    setSelectedEquipment(null);
    setShowModal(true);
  };

  const handleEdit = (equipment) => {
    setSelectedEquipment(equipment);
    setShowModal(true);
  };

  const handleDelete = (equipment) => {
    if (confirm(`Are you sure you want to delete ${equipment.name}?`)) {
      axiosClient.delete(`/equipments/${equipment.id}`)
        .then(() => {
          setNotification('Equipment deleted successfully.');
          fetchEquipments();
        });
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEquipment(null);
  };
  const filteredEquipments =equipments.filter(eq =>
    Object.values(eq).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (selectedFilter === "" || eq.name === selectedFilter)
  );
  const totalPages = Math.ceil(filteredEquipments.length / pageSize);
  const paginatedEquipments = filteredEquipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Equipments</h1>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          marginBottom: '1rem',
        }}
      >
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
        <button className="btn-add" onClick={handleAddNew}>
          Add New
        </button>
      </div>
      
      <div className="card animated fadeInDown" style={{ overflowX: 'auto', marginTop: "0rem" }}>
        <table>
          <thead>
            <tr>
              <th>Actions</th>
              <th>Name of Property</th>
              <th>Description</th>
              <th>Plate No.</th>
              <th>Chassis No.</th>
              <th>Engine No.</th>
              <th>Accountable Office</th>
              <th>Property/Equipment No.</th>
              <th>Date Acquired</th>
              <th>Acquisition Cost</th>
              <th>Date Unserviceable</th>
              <th>Accountable Officer</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr><td colSpan="12" className="text-center">Loading...</td></tr>
            </tbody>
          ) : (
            <tbody>
              {/*equipments*/paginatedEquipments.map((eq) => (
                <tr key={eq.id}>
                  <td>
                    <button onClick={() => handleEdit(eq)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <FaEdit />
                    </button>
                    <Link to={`/equipments/${eq.id}/history`} title="History" style={{ margin: '0 10px' }}>
                      <FaHistory />
                    </Link>
                    <button onClick={() => handleDelete(eq)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <FaTrash />
                    </button>
                  </td>
                  <td>{eq.name}</td>
                  <td className="truncate-cell">{eq.description}</td>
                  <td>{eq.plate_no}</td>
                  <td>{eq.chassis_no}</td>
                  <td>{eq.engine_no}</td>
                  <td>{eq.accountable_office}</td>
                  <td>{eq.property_no}</td>
                  <td>{eq.date_acquired}</td>
                  <td>{eq.acquisition_cost}</td>
                  <td>{eq.date_unserviceable}</td>
                  <td>{eq.accountable_officer}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={handleCloseModal} className="modal-close">X</button>
            <EquipmentTableForm
              initialData={selectedEquipment}
              onClose={handleCloseModal}
              onSaved={() => {
                handleCloseModal();
                fetchEquipments();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}