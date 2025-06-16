import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { FaArrowAltCircleUp } from 'react-icons/fa';
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
  axiosClient.get("/files")
    .then(({ data }) => {
      const reversedData = data.reverse();
      setEquipments(reversedData);
      setLoading(false);

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
  const handleDownload = () =>{
    axiosClient.get('/report/equipments-with-history')
    .then(({ data }) => {

        console.log("Download Test")
      
    })
    .catch((error) => {
      console.error("Failed to fetch data", error);
    });
  };

  useEffect(() => {
    fetchEquipments();
  }, []);


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
        {/* Left: Search */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Right: Download */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-add" onClick={handleDownload}>
            Download All
          </button>
        </div>
      </div>
      
      <div className="card animated fadeInDown" style={{ overflowX: 'auto', marginTop: "0rem" }}>
        <table>
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Tracking Number</th>
              <th>Document Title</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Office Forwared/Received</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr><td colSpan="12" className="text-center">Loading...</td></tr>
            </tbody>
          ) : (
            <tbody>
              {allfiles.map((data) => (
                <tr key={data.id}>
                  <td>
                    <Link to={`/`} title="Track File" style={{ margin: '0 10px' }}>
                      <FaArrowAltCircleUp />
                    </Link>
                  </td>
                  <td>{data.doc_type}</td>
                  <td>{data.track_no}</td>
                  <td>{data.doc_title}</td>
                  <td>{data.date_created}</td>
                  <td>{data.status}</td>
                  <td>{data.office}</td>
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
    </div>
  );
}