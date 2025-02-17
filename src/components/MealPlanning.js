// src/components/MealPlanning.js
import React, { useState } from 'react';

function MealPlanning() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState({
    lactoseIntolerant: false,
    glutenFree: false,
    allergies: ''
  });
  const [mealPlan, setMealPlan] = useState([]);

  const handleDietaryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDietaryRestrictions(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateMealPlan = () => {
    // This is a placeholder function. In a real application, you would
    // implement logic to generate a meal plan based on fridge inventory
    // and dietary restrictions.
    const newMealPlan = [
      { day: 'Monday', meals: ['Breakfast: Oatmeal', 'Lunch: Salad', 'Dinner: Grilled Chicken'] },
      { day: 'Tuesday', meals: ['Breakfast: Smoothie', 'Lunch: Sandwich', 'Dinner: Pasta'] },
      // ... more days
    ];
    setMealPlan(newMealPlan);
  };

  return (
    <div>
      <h2>Meal Planning</h2>
      <form>
        <label>
          Lactose Intolerant:
          <input
            type="checkbox"
            name="lactoseIntolerant"
            checked={dietaryRestrictions.lactoseIntolerant}
            onChange={handleDietaryChange}
          />
        </label>
        <label>
          Gluten Free:
          <input
            type="checkbox"
            name="glutenFree"
            checked={dietaryRestrictions.glutenFree}
            onChange={handleDietaryChange}
          />
        </label>
        <label>
          Allergies:
          <input
            type="text"
            name="allergies"
            value={dietaryRestrictions.allergies}
            onChange={handleDietaryChange}
            placeholder="e.g., peanuts, shellfish"
          />
        </label>
      </form>
      <button onClick={generateMealPlan}>Generate Meal Plan</button>
      <div>
        <h3>Weekly Meal Plan</h3>
        {mealPlan.map(day => (
          <div key={day.day}>
            <h4>{day.day}</h4>
            <ul>
              {day.meals.map(meal => <li key={meal}>{meal}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MealPlanning;