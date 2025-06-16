import {Link} from "react-router-dom";
import {createRef, useState, useEffect} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
export default function Signup() {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();

  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [offices, setOffices] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState("");

  useEffect(() => {
    axiosClient.get('/offices')
      .then(({ data }) => setOffices(data))
      .catch(() => setOffices([]));
  }, []);
  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
      office_id: selectedOfficeId, // include selected office
    };

    axiosClient.post('/signup', payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Signup for Free</h1>
          {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }
          <input ref={nameRef} type="text" placeholder="Full Name" />
          <input ref={emailRef} type="email" placeholder="Email Address" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input ref={passwordConfirmationRef} type="password" placeholder="Repeat Password" />

          <select value={selectedOfficeId} onChange={(e) => setSelectedOfficeId(e.target.value)}>
            <option value="">-- Select Office --</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name} ({office.abbreviation})
              </option>
            ))}
          </select>
          <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
        </form>
      </div>
    </div>
  )
}