import '../Styles/navbar.css';
import React from "react";

const Navbar = ({ name }) => {

  return (
    <nav className="n_navbar_omg">
      <div className="n_container">
        <div className="n_nav-content">
          <div className="n_logo-container">
          <span className="text-2xl font-bold tracking-wide text-[rgb(0,0,128)]  hea">
          ScoreVengers
        </span>
          </div>
          <div className="n_user-greeting">
            <span className="n_greeting-text">
              Hello, <span className="n_greeting-name">{localStorage.getItem("userName")|| 'Autonomous'}</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
