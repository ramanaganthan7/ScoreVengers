import '../Styles/navbar.css';
import React from "react";

const Navbar = ({ name }) => {
  console.log(name, 'navbar.jsx'); // Debugging log

  return (
    <nav className="n_navbar">
      <div className="n_container">
        <div className="n_nav-content">
          <div className="n_logo-container">
            <img
              src={"./logo.png"}
              alt="Logo"
              width={40}
              height={40}
              className="n_logo-image"
            />
          </div>
          <div className="n_user-greeting">
            <span className="n_greeting-text">
              Hello, <span className="n_greeting-name">{name || 'Autonomous'}</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
