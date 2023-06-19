import React from "react";
import {  NavLink, Outlet } from "react-router-dom";
import { FiFacebook,FiInstagram,FiTwitter } from "react-icons/fi";




function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel eleifend libero.</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>123 Main Street<br/>Anytown, USA 12345<br/>(555) 555-5555 <br /> email@example.com</p>
        </div>
        <div className="footer-section">
          <h3>FAQs</h3>
          <ul>
            <li>
              <NavLink to="/">Shipping & Delivery</NavLink>
            </li>
            <li>
              <NavLink to="/">Returns & Exchanges</NavLink>
            </li>
            <li>
              <NavLink to="/">Payment & Ordering</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><NavLink to="/">Privacy Policy</NavLink></li>
            <li><NavLink to="/">Terms & Conditions</NavLink></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <NavLink to="/"><FiFacebook/></NavLink>
            <NavLink to="/"><FiTwitter/></NavLink>
            <NavLink to="/"><FiInstagram/></NavLink>
          </div>
        </div>


        
      </div>
    </footer>
  );
}

export default Footer;
