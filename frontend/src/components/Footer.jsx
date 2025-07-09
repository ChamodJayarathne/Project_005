import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Wonder choice pvt limited. All rights
        reserved.
      </p>
      <div style={{ marginTop: "10px" }}>
        <a
          href="#"
          style={{
            color: "#fff",
            marginRight: "20px",
            textDecoration: "none",
          }}
        >
          Privacy Policy
        </a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
