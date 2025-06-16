import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function OfficeForm({ initialData, onSaved, onClose }) {
  const [office, setOffice] = useState({
    id: null,
    name: '',
    abbreviation: ''
  });

  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (initialData) setOffice(initialData);
  }, [initialData]);

  const onSubmit = (e) => {
    e.preventDefault();
    const request = office.id
      ? axiosClient.put(`/offices/${office.id}`, office)
      : axiosClient.post(`/offices`, office);

    request
      .then(() => {
        setNotification(`Office was successfully ${office.id ? 'updated' : 'created'}`);
        onSaved?.();
        onClose?.();
      })
      .catch(err => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <>
      <h1>{office.id ? "Edit Office" : "New Office"}</h1>
      <div className="card animated fadeInDown">
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input value={office.name} onChange={e => setOffice({ ...office, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Abbreviation</label>
              <input value={office.abbreviation} onChange={e => setOffice({ ...office, abbreviation: e.target.value })} />
            </div>
          </div>
          <button className="btn" style={{ marginTop: "1rem" }}>Save</button>
        </form>
      </div>
    </>
  );
}
