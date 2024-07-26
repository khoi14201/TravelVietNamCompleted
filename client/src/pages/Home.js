import React from "react";
import NavBar from "../components/NavBar";
import Login from "../components/user/Login";

import BottomNav from "../components/BottomNav";

const Home = () => {
  return (
    <>
      <Login />
      <NavBar />
      <BottomNav />
    </>
  );
};

export default Home;
