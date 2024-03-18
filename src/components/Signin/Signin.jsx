import React, { useEffect, useRef, useState } from "react";
import styles from "./Signin.module.scss";
import axios from "axios";
function Signin() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [isError, setError] = useState(false);
  const [users, setUsers] = useState([{ id: 0, login: "adm" }]);

  const handleUsernameChange = (e) => {
    if (Number(e.target.value)) {
      return 0;
    } else {
      setUsername(e.target.value);
    }
  };
  const handleCodeChange = (e) => {
    if (!isNaN(e.target.value)) {
      setCode(e.target.value);
    }
  };

  const handleUsernameClick = (e) => {};
  useEffect(() => {
    axios
      .get(`https://65eafaa243ce16418932f611.mockapi.io/popit/popit`)
      .then((resp) => {
        console.log(resp.data);
        setUsers(resp.data);
      });
  }, []);

  const handleSubmit = (e) => {
    if (isError) {
      setError(false);
    }
    e.preventDefault();
    if (!username || !code) {
      return 0;
    }
    const findedUser = users.filter(
      (user) => user.login === username && user.code === code
    );

    if (!findedUser.length) {
      setError(true);
      return 0;
    } else {
      localStorage.setItem("isAuth", true);
      localStorage.setItem("authId", findedUser[0].id);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  const codeField = useRef();
  const loginField = useRef();

  return (
    <div className={styles.root}>
      <h2 style={{ marginTop: 0, opacity: 0.7, fontSize: "18px" }}>Вход</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Логин:
          <input
            type="text"
            maxLength={20}
            value={username}
            onChange={handleUsernameChange}
            onClick={handleUsernameClick}
            ref={loginField}
            minLength={3}
            required
          />
        </label>
        <label>
          Пароль:
          <input
            type="password"
            maxLength={4}
            value={code}
            onChange={handleCodeChange}
            pattern="[0-9]*"
            inputMode="numeric"
            ref={codeField}
            minLength={4}
            required
          />
        </label>
        <br />
        <div style={{ display: "flex" }}>
          <button type="submit">Вход</button>
        </div>
        {isError ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ color: "red", fontSize: "10px", padding: "15px 0" }}>
              Не правильный логин или пароль
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ opacity: 0 }}>Всё хорошо</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default Signin;
