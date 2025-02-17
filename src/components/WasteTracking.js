// src/components/WasteTracking.js
import React, { useState } from 'react';

function WasteTracking() {
  const [wasteItems, setWasteItems] = useState([]);
  const [newWasteItem, setNewWasteItem] = useState('');

  const handleAddWasteItem = (e) => {
    e.preventDefault();
    if (newWasteItem) {
      setWasteItems([...wasteItems, newWasteItem]);
      setNewWasteItem('');
    }
  };

  return (
    <div>
      <h2>Waste Tracking</h2>
      <form onSubmit={handleAddWasteItem}>
        <input
          type="text"
          value={newWasteItem}
          onChange={(e) => setNewWasteItem(e.target.value)}
          placeholder="Enter wasted item"
          required
        />
        <button type="submit">Add to Waste</button>
      </form>
      <ul>
        {wasteItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>Tips for reducing waste:</p>
      <ul>
        <li>Plan meals based on what you already have</li>
        <li>Store food properly to extend its shelf life</li>
        <li>Compost organic waste</li>
      </ul>
    </div>
  );
}

export default WasteTracking;