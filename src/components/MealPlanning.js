import React, { useState, useEffect } from "react";
import "./MealPlanning.css";

const MealPlanning = () => {
  const meals = [
    {
      day: "Monday",
      breakfast: ["Oatmeal", "Fruits", "Milk"],
      lunch: ["Grilled Chicken", "Quinoa", "Spinach"],
      dinner: ["Tofu", "Vegetables", "Rice"],
      tags: ["Lactose", "Gluten-Free", "Vegetarian"],
    },
    {
      day: "Tuesday",
      breakfast: ["Avocado Toast", "Eggs"],
      lunch: ["Pasta", "Pesto", "Parmesan"],
      dinner: ["Salmon", "Broccoli", "Garlic"],
      tags: ["Vegetarian"],
    },
    {
      day: "Wednesday",
      breakfast: ["Greek Yogurt", "Honey", "Granola"],
      lunch: ["Chicken Caesar Salad", "Croutons"],
      dinner: ["Vegetable Curry", "Rice"],
      tags: ["Vegetarian", "Gluten-Free"],
    },
    {
      day: "Thursday",
      breakfast: ["Smoothie", "Banana", "Berries"],
      lunch: ["Turkey Sandwich", "Spinach"],
      dinner: ["Lentil Soup", "Garlic Bread"],
      tags: ["Vegan", "Gluten-Free"],
    },
    {
      day: "Friday",
      breakfast: ["Pancakes", "Maple Syrup"],
      lunch: ["Grilled Cheese", "Tomato Soup"],
      dinner: ["Shrimp Stir-fry", "Noodles"],
      tags: ["Vegetarian"],
    },
    {
      day: "Saturday",
      breakfast: ["Banana Pancakes"],
      lunch: ["Tuna Salad", "Crackers"],
      dinner: ["Homemade Pizza", "Veggies"],
      tags: ["Vegetarian", "Lactose"],
    },
    {
      day: "Sunday",
      breakfast: ["French Toast", "Berries"],
      lunch: ["BBQ Chicken", "Mashed Potatoes"],
      dinner: ["Vegetable Lasagna"],
      tags: ["Vegetarian"],
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState(meals);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let filtered = meals;

    if (selectedFilters.length > 0) {
      filtered = meals.filter((meal) =>
        selectedFilters.every((filter) => meal.tags.includes(filter))
      );
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((meal) =>
        Object.values(meal)
          .flat()
          .some((ingredient) =>
            ingredient.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    setFilteredMeals(filtered);
  }, [selectedFilters, search]);

  const toggleFilter = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  return (
    <div className="meal-planning">
      <h2 className="title">🍽️ Weekly Meal Plan</h2>

      {/* Dietary Preferences */}
      <div className="filters">
        <label>
          <input
            type="checkbox"
            onChange={() => toggleFilter("Lactose")}
            checked={selectedFilters.includes("Lactose")}
          />
          Lactose Intolerant
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => toggleFilter("Vegetarian")}
            checked={selectedFilters.includes("Vegetarian")}
          />
          Vegetarian
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => toggleFilter("Vegan")}
            checked={selectedFilters.includes("Vegan")}
          />
          Vegan
        </label>
        <label>
          <input
            type="checkbox"
            onChange={() => toggleFilter("Gluten-Free")}
            checked={selectedFilters.includes("Gluten-Free")}
          />
          Gluten-Free
        </label>
      </div>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search meals by pantry items..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Meal Cards */}
      <div className="meal-container">
        {filteredMeals.map((meal, index) => (
          <div className="meal-card" key={index}>
            <h3 className="day">{meal.day}</h3>
            <p><strong>🍳 Breakfast:</strong> {meal.breakfast.join(", ")}</p>
            <p><strong>🥗 Lunch:</strong> {meal.lunch.join(", ")}</p>
            <p><strong>🍛 Dinner:</strong> {meal.dinner.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanning;
