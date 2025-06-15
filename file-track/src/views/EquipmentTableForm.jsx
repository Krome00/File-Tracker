import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function EquipmentTableForm({ initialData, onSaved, onClose }) {
  const [equipment, setEquipment] = useState({
    id: null,
    name: '',
    description: '',
    plate_no: '',
    chassis_no: '',
    engine_no: '',
    accountable_office: '',
    property_no: '',
    date_acquired: '',
    acquisition_cost: '',
    date_unserviceable: '',
    accountable_officer: ''
  });

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  // Set form data when editing
  useEffect(() => {
    if (initialData) {
      setEquipment(initialData);
    }
  }, [initialData]);

  const onSubmit = ev => {
    ev.preventDefault();
    const request = equipment.id
      ? axiosClient.put(`/equipments/${equipment.id}`, equipment)
      : axiosClient.post('/equipments', equipment);

    request
      .then(() => {
        setNotification(`Equipment was successfully ${equipment.id ? 'updated' : 'created'}`);
        onSaved?.();  // triggers parent refresh
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <>
      {equipment.id ? <h1>Update Equipment</h1> : <h1>New Equipment</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }

        {!loading && (
          <form onSubmit={onSubmit} className="equipment-form">
            {/* Form fields remain unchanged */}
            <div className="form-row">
              <div className="form-group long">
                <label>Name of Property</label>
                <input value={equipment.name} onChange={e => setEquipment({ ...equipment, name: e.target.value })} />
              </div>
              <div className="form-group short">
                <label>Plate No.</label>
                <input value={equipment.plate_no} onChange={e => setEquipment({ ...equipment, plate_no: e.target.value })} />
              </div>
              <div className="form-group short">
                <label>Chassis No.</label>
                <input value={equipment.chassis_no} onChange={e => setEquipment({ ...equipment, chassis_no: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group long">
                <label>Description</label>
                <textarea value={equipment.description} onChange={e => setEquipment({ ...equipment, description: e.target.value })} rows={4} />
              </div>
              <div className="form-group short">
                <label>Engine No.</label>
                <input value={equipment.engine_no} onChange={e => setEquipment({ ...equipment, engine_no: e.target.value })} />
              </div>
              <div className="form-group short">
                <label>Acquisition Cost</label>
                <input value={equipment.acquisition_cost} onChange={e => setEquipment({ ...equipment, acquisition_cost: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Property/Equipment No.</label>
                <input value={equipment.property_no} onChange={e => setEquipment({ ...equipment, property_no: e.target.value })} />
              </div>
              <div>
                <label>Date Acquired</label>
                <input type="date" value={equipment.date_acquired} onChange={e => setEquipment({ ...equipment, date_acquired: e.target.value })} />
              </div>
              <div>
                <label>Date Unserviceable</label>
                <input type="date" value={equipment.date_unserviceable} onChange={e => setEquipment({ ...equipment, date_unserviceable: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Accountable Office</label>
                <input value={equipment.accountable_office} onChange={e => setEquipment({ ...equipment, accountable_office: e.target.value })} />
              </div>
              <div>
                <label>Accountable Officer</label>
                <input value={equipment.accountable_officer} onChange={e => setEquipment({ ...equipment, accountable_officer: e.target.value })} />
              </div>
            </div>

            <button className="btn" style={{ marginTop: "1rem" }}>Save</button>
          </form>
        )}
      </div>
    </>
  );
}
