import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
const BASE_URL = "http://localhost:9000";

function App() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        alert("There was an error loading data");
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<AppLayout />}>
          <Route
            index
            element={<CityList cities={cities} loading={loading} />}
          />
          <Route
            path="cities"
            element={<CityList cities={cities} loading={loading} />}
          />
          <Route
            path="countries"
            element={<CountryList cities={cities} loading={loading} />}
          />
          <Route path="form" element={<p>Form</p>} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
