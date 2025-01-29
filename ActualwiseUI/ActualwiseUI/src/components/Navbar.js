import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../AuthContext";

function Navbar() {
  const { isAuthenticated } = useAuth();

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <i class="fas fa-laptop-medical" />
          <span style={{ fontSize: "20px" }}>Actualwise Consulting</span>
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/services"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Services
            </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <Button onClick={() => alert("Sign out feature here!")}>
                Logout
              </Button>
            ) : (
              <Link to="/register" className="nav-links">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
