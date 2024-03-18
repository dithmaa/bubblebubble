import React from "react";
import styles from "./Header.module.scss";
import popitImg from "../../assets/img/popi.png";
import { NavLink } from "react-router-dom";

function Header({ type }) {
  console.log(type);
  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <img src={popitImg} alt="Popit" />
        <span>Bubble it</span>
      </div>
      <nav className="top-nav">
        {type === 0 ? (
          <NavLink to="/login">Войти</NavLink>
        ) : (
          <NavLink to="/">Регистрация</NavLink>
        )}
      </nav>
    </div>
  );
}

export default Header;
