import React, { useEffect, useRef, useState } from "react";
import styles from "./Signup.module.scss";
import axios from "axios";
function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [isExisted, setIsExisted] = useState(false);
  const [users, setUsers] = useState([{ id: 0, login: "adm" }]);
  const [isDisabled, setDisabled] = useState(false);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    if (Number(e.target.value)) {
      return 0;
    } else {
      setUsername(e.target.value);
      if (isExisted) {
        setIsExisted(false);
      }
      // console.log(e.target.value);
    }
    const loginLength = username.length + 1;
    console.log(loginLength);
    if (loginLength < 3) {
      loginField.current.classList.add("error");
    } else if (loginLength >= 3) {
      loginField.current.classList.remove("error");
    }
  };
  const handleCodeChange = (e) => {
    if (!isNaN(e.target.value)) {
      setCode(e.target.value);
    }

    const codeLength = code.length + 1;
    // console.log(codeLength);
    if (codeLength === 4) {
      // console.log("감사합니다");
      codeField.current.classList.remove("error");
    } else {
      codeField.current.classList.add("error");
      // console.log("hehe");
    }
  };

  const handleUsernameClick = (e) => {
    if (loginField.current.classList.contains("error")) {
      loginField.current.classList.remove("error");
    }
  };
  useEffect(() => {
    axios
      .get(`https://65eafaa243ce16418932f611.mockapi.io/popit/popit`)
      .then((resp) => {
        console.log(resp.data);
        setUsers(resp.data);
      });
  }, []);

  useEffect(() => {
    users.filter((user) => {
      user.login === username
        ? setIsExisted(true)
        : console.log("아직 안 찾었어요");
    });
  }, [users, username]);
  console.log("ddddddddddd", isExisted);
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      clickAmount: 0,
      clickPerOne: 1,
      login: username,
      code: code,
      boosts: [
        {
          id: 1,
          title: "Бабл гам",
          level: 0,
          price: 100,
          image: "https://i.ibb.co/MByxY7V/icon-boost-1.png",
          power: 1,
        },
        {
          id: 2,
          title: "Буба-Буба",
          level: 0,
          price: 500,
          image: "https://i.ibb.co/sW1b7hy/icon-boost-2.png",
          power: 8,
        },
        {
          id: 3,
          title: "Мега Пузыри",
          level: 0,
          price: 50000,
          image:
            "https://i.ibb.co/hX68f3S/realistic-transparent-3d-bubbles-underwater-soap-bubbles-vector-illustration-png.webp",
          power: 28,
        },
        {
          id: 4,
          title: "Вселенная пузырей",
          level: 0,
          price: 1000000,
          image: "https://i.ibb.co/CwvgrWJ/icon.png",
          power: 70,
        },
      ],
    };
    console.log("Email:", email);
    console.log("Username:", username);
    console.log(newUser);
    if (!username) {
      loginField.current.classList.add("error");
      return 0;
    } else if (!code) {
      codeField.current.classList.add("error");
      return 0;
    }
    const codeLength = code.length;
    const usernameLength = username.length;

    if (codeLength != 4) {
      return 0;
    }
    if (usernameLength < 3) {
      return 0;
    }

    if (!isExisted) {
      setDisabled(true);
      axios
        .post(
          "https://65eafaa243ce16418932f611.mockapi.io/popit/popit",
          newUser
        )
        .then(() => {
          localStorage.setItem("isAuth", true);
          localStorage.setItem(
            "authId",
            Number(users[users.length - 1].id) + 1
          );
          console.log("please wait...");

          setTimeout(() => {
            window.location.reload();
          }, 400);
        });

      // setTimeout(() => {
      //
      // }, 100);
    }
  };
  const codeField = useRef();
  const loginField = useRef();

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0, opacity: 0.7, fontSize: "18px" }}>
          Регистрация
        </h2>
        <label>
          Логин:
          <span
            style={{
              color: "#fff",
              opacity: "0.5",
              fontWeight: 400,
              display: "block",
              fontSize: "11px",
            }}
          >
            минимум 3 символа
          </span>
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
          <span
            style={{
              color: "#fff",
              opacity: "0.5",
              fontWeight: 400,
              display: "block",
              fontSize: "11px",
            }}
          >
            введите любые 4 цифры
          </span>
          <input
            type="password"
            maxLength={4}
            value={code}
            onChange={handleCodeChange}
            pattern="[0-9]*"
            inputMode="numeric"
            ref={codeField}
            required
            minLength={4}
          />
        </label>
        <br />
        <div style={{ display: "flex" }}>
          {!isDisabled ? (
            <button type="submit">Регистрация</button>
          ) : (
            <button type="submit" style={{ opacity: 0.3 }} disabled={true}>
              Регистрация
            </button>
          )}
        </div>
        {isExisted ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ color: "red", fontSize: "10px", padding: "15px 0" }}>
              Пользователь с таким логином уже существует
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

export default Signup;
