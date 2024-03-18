import { useCallback, useEffect, useState } from "react";

import { NavLink, Route, Router, Routes } from "react-router-dom";
import Game from "./components/Game/Game";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";

function App() {
  const [isAuth, setAuth] = useState(
    localStorage.getItem("isAuth") ? localStorage.getItem("isAuth") : false
  );
  const [authId, setAuthId] = useState(
    localStorage.getItem("authId") ? localStorage.getItem("authId") : 0
  );

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Game authId={authId} /> : <Signup />}
        />
        <Route
          path="/login"
          element={isAuth ? <Game authId={authId} /> : <Signin />}
        />
      </Routes>
    </div>
  );
}

export default App;
