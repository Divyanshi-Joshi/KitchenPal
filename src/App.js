// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';
import FridgeManagement from './components/FridgeManagement';
import MealPlanning from './components/MealPlanning';
import WasteTracking from './components/WasteTracking';
import GroceryList from './components/GroceryList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fridge" element={<FridgeManagement />} />
          <Route path="/meal-planning" element={<MealPlanning />} />
          <Route path="/waste-tracking" element={<WasteTracking />} />
          <Route path="/grocery-list" element={<GroceryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;