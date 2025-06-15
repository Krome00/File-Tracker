import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
export default function HistoryTableForm({ initialData, equipmentId, onSaved, onClose }) {
  const [record, setRecord] = useState({
    id: null,
    equipment_id: equipmentId,
    date_of_service: '',
    po_number: '',
    po_date: '',
    supplier_or_mechanic: '',
    dr_or_si_number: '',
    dr_or_si_date: '',
    maintenance_details: '',
    remarks: '',
    parts: [
      {
        part_name: "",
        qty: "",
        unit: "",
        unit_price: "",
        total: ""
      }
    ]  // array of part objects
  });

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

 useEffect(() => {
    if (initialData) {
      setRecord({
        ...initialData,
        parts:
          Array.isArray(initialData.parts) && initialData.parts.length > 0
            ? initialData.parts
            : [
                {
                  part_name: "",
                  qty: "",
                  unit: "",
                  unit_price: "",
                  total: ""
                }
              ]
      });
    } else {
      // If creating new record (no initialData), ensure at least one empty row
      setRecord((prev) => ({
        ...prev,
        parts:
          Array.isArray(prev.parts) && prev.parts.length > 0
            ? prev.parts
            : [
                {
                  part_name: "",
                  qty: "",
                  unit: "",
                  unit_price: "",
                  total: ""
                }
              ]
      }));
    }
  }, [initialData]);

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...record.parts];

    if ((field === "qty" || field === "unit_price") && parseFloat(value) < 0) {
      return; // Do not allow update
    }
    
    updatedParts[index][field] = value;

    // Auto-calculate total
    if (field === "qty" || field === "unit_price") {
      const qty = parseFloat(updatedParts[index].qty);
      const price = parseFloat(updatedParts[index].unit_price) || 0;

      // If qty is not a valid number or is 0, use unit_price as total
      if (isNaN(qty) || qty === 0) {
        updatedParts[index].total = price.toFixed(2);
      } else {
        updatedParts[index].total = (qty * price).toFixed(2);
      }
    }

    setRecord({ ...record, parts: updatedParts });
  };

  const addPart = () => {
    setRecord({
      ...record,
      parts: [
        ...record.parts,
        { part_name: "", qty: "", unit: "", unit_price: "", total: "", remarks: "" }
      ]
    });
  };

  const removePart = (index) => {
    const updatedParts = [...record.parts];
    updatedParts.splice(index, 1);
    setRecord({ ...record, parts: updatedParts });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = record.id
      ? axiosClient.put(`/history/${record.id}`, record)
      : axiosClient.post(`/equipments/${equipmentId}/history`, record);

    request
      .then(() => {
        setNotification(`History record ${record.id ? "updated" : "created"} successfully.`);
        onSaved?.();
        onClose?.(); // close modal after save
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h1>{record.id ? "Update History Record" : "New History Record"}</h1>
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && (
          <form onSubmit={onSubmit} className="equipment-form">
            {/* Basic info fields */}
            <div className="form-row">
              <div><label>Date of Service</label>
                <input type="date" value={record.date_of_service} onChange={e => setRecord({ ...record, date_of_service: e.target.value })} />
              </div>
              <div><label>PO Number</label>
                <input value={record.po_number} onChange={e => setRecord({ ...record, po_number: e.target.value })} />
              </div>
              <div><label>PO Date</label>
                <input type="date" value={record.po_date} onChange={e => setRecord({ ...record, po_date: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div><label>Supplier / Mechanic</label>
                <input value={record.supplier_or_mechanic} onChange={e => setRecord({ ...record, supplier_or_mechanic: e.target.value })} />
              </div>
              <div><label>D.R. / S.I. Number</label>
                <input value={record.dr_or_si_number} onChange={e => setRecord({ ...record, dr_or_si_number: e.target.value })} />
              </div>
              <div><label>D.R. / S.I. Date</label>
                <input type="date" value={record.dr_or_si_date} onChange={e => setRecord({ ...record, dr_or_si_date: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group long">
                <label>Detail of Maintenance / Repair</label>
                <textarea rows={3} value={record.maintenance_details} onChange={e => setRecord({ ...record, maintenance_details: e.target.value })} />
              </div>
            </div>

            <div className="parts-section">
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Parts Replaced (if any)</label>

                {/* Header row */}
                <div className="parts-row parts-header">
                    <div className="parts-col short-name">Part Name</div>
                    <div className="parts-col short-qty">QTY</div>
                    <div className="parts-col short-unit">Unit</div>
                    <div className="parts-col short">Unit Price</div>
                    <div className="parts-col short">Total</div>
                    <div className="parts-col actions"></div>
                </div>

                {/* Input rows */}
                {record.parts.map((part, index) => (
                    <div className="parts-row"  key={index}>
                        <div className="parts-col short-name">
                            <input value={part.part_name} onChange={e => handlePartChange(index, "part_name", e.target.value)} />
                        </div>
                        <div className="parts-col short-qty">
                            <input type="number" min="0" value={part.qty} onChange={e => handlePartChange(index, "qty", e.target.value)} />
                        </div>
                        <div className="parts-col short-unit">
                            <input value={part.unit} onChange={e => handlePartChange(index, "unit", e.target.value)} />
                        </div>
                        <div className="parts-col short">
                            <input type="number" min="0" value={part.unit_price} onChange={e => handlePartChange(index, "unit_price", e.target.value)} />
                        </div>
                        <div className="parts-col short">
                            <input type="number" value={part.total} readOnly />
                        </div>
                        <div className="parts-col actions">
                            <button type="button" className="btn-remove" onClick={() => removePart(index)}>Remove</button>
                        </div>
                    </div>
                ))}

                    {/* Add Part button */}
                    <div style={{ marginTop: "0.5rem"}}>
                        <button type="button" className="btn" onClick={addPart} style={{
                        backgroundColor: "#3b82f6", // Tailwind blue-500
                        color: "white",
                        fontSize: "0.9rem",
                        padding: "4px 8px",
                        border: "none",
                        borderRadius: "4px", // no edges
                        cursor: "pointer",
                        height: "28px"
                        }}>+ Add Part</button>
                    </div>
                </div>

                {/* Remarks Section */}
                <div className="form-row">
                <div className="form-group long">
                    <label>Remarks / Recommendation</label>
                    <textarea rows={3} value={record.remarks} onChange={e => setRecord({ ...record, remarks: e.target.value })} />
                </div>
            </div>

            <button className="btn" style={{ marginTop: "1rem" }}>Save</button>
          </form>
        )}
      </div>
    </>
  );
}