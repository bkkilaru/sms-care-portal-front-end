import React from "react";
import Navbar from "./Navbar";
import "../styles/main.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AppContainer = ({ children }: { children: any }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default AppContainer;
