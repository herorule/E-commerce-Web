import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { BiShoppingBag } from "react-icons/bi";
import "./index.css";
import { FaOutdent } from "react-icons/fa";
import React, { useCallback, useRef, useState } from "react";
import { useUserContext } from "./context/user_context";

function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
  const { isLoggedIn,handleLogout } = useUserContext();
  

  return (
    <>
      <>
        <section className="header">
          <Logo width={180} height={90} />
          <button
            className="hamburger"
            onClick={() => {
              setIsNavExpanded(!isNavExpanded);
            }}
          >
            <FaOutdent />
          </button>
          <div
            className={
              isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
            }
          >
            <div className="expanded">
              <ul className="navbar">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="products_page"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Shop
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="cart_page"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <BiShoppingBag />
                  </NavLink>
                </li>
                <li>
                  {isLoggedIn ? (
                    <button onClick={handleLogout}>Logout</button>
                  ) : (
                    <NavLink
                    to="login"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    login
                  </NavLink>
                  )}
                  
                </li>
                {/* <li>
                <NavLink
                  to="register"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Register
                </NavLink>
              </li> */}
              </ul>
            </div>
          </div>
        </section>
        <Outlet />
      </>
    </>
  );
}
export default Navbar;
