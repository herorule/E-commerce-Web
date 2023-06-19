import ShopItem from "./ShopItem";
import SelectInput from "./SelectInput";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useCartContext } from "./context/cart_context";
import { useRef } from "react";
import "./components/product.css";

function Products_page() {
  const { addToCart } = useCartContext();
  const [products, setProducts] = useState([]);
  const [cs, setCs] = useState([]);
  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async function () {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BE_URI}product`);
      setProducts(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  
  const fetchC = useCallback(async function () {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BE_URI}category`);
      setCs(data);
    } catch (error) {
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchC()
  }, [fetchData, fetchC]);

  return (
    <div className="shop-body">
      <form className="Shop">
        <div className="shop-mid">
          <SelectInput title="Category" options={cs} />
          <ShopItem title="Name" type="text" />
          <ShopItem title="Min Price" type="number" />
          <ShopItem title="Max Price" type="number" />

          <div className="shop-item-submit">
            <button>search</button>
          </div>
        </div>
      </form>
      <br />
      <br />
      <br />
      <br />

      <section className="p_box">
        {products.map((p) => (
          <article key={p._id}>
            <div className="p_image">
              <img src={p.url || "/no-img.png"} alt="" />
            </div>

            <div className="p_details">
              <p>{p.name}</p>
              <p>Price:{p.price}$</p>
              {/* <p>{p.discount}</p> */}
              <p>{p.description}</p>
              <button
                onClick={(e) => {
                  addToCart(p._id, 1, p);
                }}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Products_page;
