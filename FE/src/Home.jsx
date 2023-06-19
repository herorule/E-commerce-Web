import { Link } from "react-router-dom";
import Footer from "./Footer";
import "./index.css";


import axios from "axios";
import { useCallback, useEffect, useState } from "react";


function Home() {

  return (
    <div className="App">
      <div className="mid">
        <h4>Trade-in-offer</h4>
        <h2>Super value deals</h2>
        <h1>On all products</h1>
        <p>Save more with coupons & up to 70% off!</p>
        <Link to="products_page">
          <button> ShopNow  </button>
        </Link>
      </div>

      
      <Footer />
    </div>
  );
}

export default Home;
