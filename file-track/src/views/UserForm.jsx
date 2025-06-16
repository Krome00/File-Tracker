import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [offices, setOffices] = useState([]);
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    office_id: ''
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    // Load office list
    axiosClient.get('/offices').then(({ data }) => {
      setOffices(data);
    });

    // Load user if editing
    if (!id) return;

    setLoading(true);
    axiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setUser({
          ...data,
          password: '',
          password_confirmation: ''
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const onSubmit = ev => {
    ev.preventDefault();
    const request = user.id
      ? axiosClient.put(`/users/${user.id}`, user)
      : axiosClient.post('/users', user);

    request
      .then(() => {
        setNotification(`User was successfully ${user.id ? "updated" : "created"}`);
        navigate('/users');
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
      <h1>{user.id ? `Update User: ${user.name}` : "New User"}</h1>
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
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={ev => setUser({ ...user, name: ev.target.value })}
              placeholder="Name"
            />
            <input
              value={user.email}
              onChange={ev => setUser({ ...user, email: ev.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              onChange={ev => setUser({ ...user, password: ev.target.value })}
              placeholder="Password"
            />
            <input
              type="password"
              onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })}
              placeholder="Password Confirmation"
            />

            {/* Office selection */}
             <label style={{ marginTop: "1rem", fontWeight: "bold" }}>Office</label>
              <select
                value={user.office_id || ''}
                onChange={ev => setUser({ ...user, office_id: ev.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  marginBottom: "1rem"
                }}
              >
                <option value="">-- Select Office --</option>
                {offices.map(office => (
                  <option key={office.id} value={office.id}>
                    {office.name} ({office.abbreviation})
                  </option>
                ))}
              </select>

            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
