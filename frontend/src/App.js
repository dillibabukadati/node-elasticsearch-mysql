import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/es?search=${searchTerm}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    setSelectedProduct(null)
    if (searchTerm) {
      setSearchResults([]);
      fetchData();
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleProductClick = async (product) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/products/${product.id}`
      );
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      <ul style={{ listStyle: "none", padding: "0" }}>
        {searchResults.map((item) => (
          <li
            key={item.id}
            style={{ margin: "10px 0", borderBottom: "1px solid #ccc",cursor:'pointer' }}
            onClick={() => handleProductClick(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {selectedProduct && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedProduct.name}</h2>
          <p>Main Category: {selectedProduct.main_category}</p>
          <p>Sub Category: {selectedProduct.sub_category}</p>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            style={{ width: "200px" }}
          />
          <p>Ratings: {selectedProduct.ratings}</p>
          <p>No. of Ratings: {selectedProduct.no_of_ratings}</p>
          <p>Discount Price: {selectedProduct.discount_price}</p>
          <p>Actual Price: {selectedProduct.actual_price}</p>
          <a target="_blank" rel="noopener noreferrer" href={selectedProduct.link}>View Product</a>
        </div>
      )}
    </div>
  );
}

export default App;
