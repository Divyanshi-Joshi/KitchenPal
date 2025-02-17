// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Kitchen Management System</h1>
      <p>Welcome to your smart kitchen solution!</p>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/fridge">Fridge Management</Link></li>
          <li><Link to="/meal-planning">Meal Planning</Link></li>
          <li><Link to="/waste-tracking">Waste Tracking</Link></li>
          <li><Link to="/grocery-list">Grocery List</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;