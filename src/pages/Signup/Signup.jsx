import React from "react";
import SignupComponent from "../../components/Signup/Signup";
import Header from "../../components/Header/Header";

function Signup() {
  return (
    <>
      <Header type={0} />
      <SignupComponent />
    </>
  );
}

export default Signup;
