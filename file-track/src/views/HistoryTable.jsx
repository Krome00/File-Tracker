import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';
import HistoryTableForm from "./HistoryTableForm";
import Pagination from "../components/Pagination";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function HistoryTable() {
  const { id: equipmentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchHistory = () => {
    setLoading(true);
    axiosClient.get(`/equipments/${equipmentId}/history`)
      .then(({ data }) => {
        setHistoryItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [equipmentId]);

  const handleAddNew = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    if (confirm("Are you sure you want to delete this record?")) {
      axiosClient.delete(`/history/${item.id}`)
        .then(() => {
          setNotification("History record deleted successfully.");
          fetchHistory();
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const paginatedItems = historyItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(historyItems.length / pageSize);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>History Records</h1>
        <button className="btn-add" onClick={handleAddNew}>Add New</button>
      </div>

      <div className="card animated fadeInDown" style={{ overflowX: 'auto', marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>Actions</th>
              <th>Date of Service</th>
              <th>P.O. No.</th>
              <th>P.O. Date</th>
              <th>Supplier/Mechanic</th>
              <th>D.R./Service Inv. No.</th>
              <th>D.R./Service Inv. Date</th>
              <th>Details of Maintenance/Repair</th>
              <th>Parts Replaced (if any)</th>
              <th>QTY</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Remarks</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr><td colSpan="14" className="text-center">Loading...</td></tr>
            </tbody>
          ) : (
            <tbody>
              {paginatedItems.map((item) => {
                const hasParts = Array.isArray(item.parts) && item.parts.length > 0;

                return hasParts ? (
                  item.parts.map((part, index) => (
                    <tr key={`${item.id}-${index}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={item.parts.length}>
                            <button onClick={() => handleEdit(item)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(item)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: "10px" }}>
                              <FaTrash />
                            </button>
                          </td>
                          <td rowSpan={item.parts.length}>{item.date_of_service}</td>
                          <td rowSpan={item.parts.length}>{item.po_number}</td>
                          <td rowSpan={item.parts.length}>{item.po_date}</td>
                          <td rowSpan={item.parts.length}>{item.supplier_or_mechanic}</td>
                          <td rowSpan={item.parts.length}>{item.dr_or_si_number}</td>
                          <td rowSpan={item.parts.length}>{item.dr_or_si_date}</td>
                          <td rowSpan={item.parts.length}>{item.maintenance_details}</td>
                        </>
                      )}
                      <td>{part.part_name || "—"}</td>
                      <td>{part.qty !== undefined && part.qty !== null ? part.qty : "—"}</td>
                      <td>{part.unit || "—"}</td>
                      <td>{part.unit_price !== undefined ? part.unit_price : "—"}</td>
                      <td>{part.total !== undefined ? part.total : "—"}</td>
                      {index === 0 && <td rowSpan={item.parts.length}>{item.remarks}</td>}
                    </tr>
                  ))
                ) : (
                  <tr key={item.id}>
                    <td>
                      <button onClick={() => handleEdit(item)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(item)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: "10px" }}>
                        <FaTrash />
                      </button>
                    </td>
                    <td>{item.date_of_service}</td>
                    <td>{item.po_number}</td>
                    <td>{item.po_date}</td>
                    <td>{item.supplier_or_mechanic}</td>
                    <td>{item.dr_or_si_number}</td>
                    <td>{item.dr_or_si_date}</td>
                    <td>{item.maintenance_details}</td>
                    <td colSpan="5" className="text-center text-muted">No parts</td>
                    <td>{item.remarks}</td>
                  </tr>
                );
              })}
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
            <HistoryTableForm
              equipmentId={equipmentId}
              initialData={selectedItem}
              onClose={handleCloseModal}
              onSaved={() => {
                handleCloseModal();
                fetchHistory();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
