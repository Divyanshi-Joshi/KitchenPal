// src/components/GroceryList.js
import React, { useState } from 'react';

function GroceryList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem) {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  return (
    <div>
      <h2>Grocery List</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add grocery item"
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>Healthy Options to Consider:</h3>
      <ul>
        <li>Fresh fruits and vegetables</li>
        <li>Whole grains</li>
        <li>Lean proteins</li>
        <li>Nuts and seeds</li>
      </ul>
    </div>
  );
}

export default GroceryList;