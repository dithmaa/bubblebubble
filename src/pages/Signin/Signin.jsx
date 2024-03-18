import React from "react";
import SignupComponent from "../../components/Signup/Signup";
import SigninComponent from "../../components/Signin/Signin";
import Header from "../../components/Header/Header";

function Signin() {
  return (
    <>
      <Header type={1} />
      <SigninComponent />
    </>
  );
}

export default Signin;
