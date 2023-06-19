
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function (url) {
  const [pros, setFros] = useState([]);
  const fetchPros = useCallback( async () => {
    try {
      const res = await axios.get(url);
      setFros(res.data)
    } catch (error) {
      console.error(error);
    }
  },[url]);

  useEffect(() => {
    fetchPros();
  }, [fetchPros]);

  return {pros}
  }