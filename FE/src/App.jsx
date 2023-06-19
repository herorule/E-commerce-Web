import { BrowserRouter, Route, Routes } from "react-router-dom";
import Products_page from "./Products";
import Home from "./Home";
import Nav from "./Navbar";
import Register from "./Register";
import Login from "./Login";
import Cart_page from "./Cart";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Nav />}>
            <Route element={<Home />} path="/" />

            <Route element={<Products_page />} path="products_page" />

            <Route element={<Login />} path="login" />
            <Route element={<Register />} path="register" />
            <Route element={<Cart_page />} path="cart_page" />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
