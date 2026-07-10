import React from 'react';
import { Link } from "react-router-dom";
import laptop from '../assets/laptop1.png';

export default function Landing() {
  return (
    <div className="landingPageContainer">

      {/* ===== NAVBAR ===== */}
      <nav>
        <div className="navHeader">
          <h2>
            <span style={{ color: "white" }}>Meet</span>
            <span className="gradientText">Pro</span>
          </h2>
          <h5 className="subText">Video Conferencing</h5>
        </div>

        <div className="navlist">
          <Link to="/" className="navLink">Join as Guest</Link>
          <Link to="/register" className="navLink">Register</Link>
          <Link to="/login" className="navButton">Login</Link>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <div className="landingMainContainer">

        {/* LEFT SECTION */}
        <div className="left">
          <h1>Connect.</h1>
          <h1 className="gradientText">Collaborate.</h1>
          <h1>Communicate.</h1>

          <br /><br />
          <span><hr /></span>
          <br /><br />
          <p  style={{ color: "grey" }}>Hd video calls.</p>
          <p style={{ color: "grey" }}>Anywhere,anytime.</p>
          <br />
          <br />
          <Link to="/home" className="ctaButton">
            Get Started →
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="right">
          <img src={laptop} alt="laptop" />
        </div>

      </div>
    </div>
  );
}