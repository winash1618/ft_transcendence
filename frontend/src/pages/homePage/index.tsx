import React from "react";
import { Button } from "antd";

const HomePage = () => {
  const logoUrl = "https://source.unsplash.com/random/100x100";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        src={
          "https://www.pngall.com/wp-content/uploads/2016/05/Ping-Pong-Download-PNG.png"
        }
        alt="Logo"
        style={{ width: "200px", height: "200px", padding: "20px" }}
      />
      <a href="_blank">
        <Button type="primary" size="large">
          Login
        </Button>
      </a>
    </div>
  );
};

export default HomePage;
