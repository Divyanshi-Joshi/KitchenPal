import React, { useState } from "react";
import "./GroceryList.css";

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Suggested items
  const suggestedItems = ["Milk", "Eggs", "Bread", "Fruits", "Vegetables", "Rice", "Pasta", "Butter"];

  // Add item from input field
  const addItem = () => {
    if (input.trim() !== "") {
      setItems([...items, input]);
      setInput("");
    }
  };

  // Add suggested item
  const addSuggestedItem = (item) => {
    if (!items.includes(item)) {
      setItems([...items, item]);
    }
  };

  // Remove item
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="grocery-container">
      <h1>🛒 Grocery List</h1>
      
      {/* Input Field */}
      <input
        type="text"
        placeholder="Add a grocery item..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addItem}>Add</button>

      {/* Grocery List */}
      <ul className="grocery-list">
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>❌</button>
          </li>
        ))}
      </ul>

      {/* Suggested Items Section */}
      <h2>📌 Suggested Items</h2>
      <ul className="suggested-items">
        {suggestedItems.map((item, index) => (
          <li key={index} onClick={() => addSuggestedItem(item)}>
            📌 {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
