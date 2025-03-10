import React, { useState, useEffect } from "react";
import "./MealPlanning.css";

const MealPlanning = () => {
  const meals = [
    {
      day: "Monday",
      breakfast: ["Oatmeal", "Fruits", "Milk"],
      lunch: ["Grilled Chicken", "Quinoa", "Spinach"],
      dinner: ["Tofu", "Vegetables", "Rice"],
    },
    {
      day: "Tuesday",
      breakfast: ["Avocado Toast", "Eggs"],
      lunch: ["Pasta", "Pesto", "Parmesan"],
      dinner: ["Salmon", "Broccoli", "Garlic"],
    },
    {
      day: "Wednesday",
      breakfast: ["Greek Yogurt", "Honey", "Granola"],
      lunch: ["Chicken Caesar Salad", "Croutons"],
      dinner: ["Vegetable Curry", "Rice"],
    },
    {
      day: "Thursday",
      breakfast: ["Smoothie", "Banana", "Berries"],
      lunch: ["Turkey Sandwich", "Spinach"],
      dinner: ["Lentil Soup", "Garlic Bread"],
    },
    {
      day: "Friday",
      breakfast: ["Pancakes", "Maple Syrup"],
      lunch: ["Grilled Cheese", "Tomato Soup"],
      dinner: ["Shrimp Stir-fry", "Noodles"],
    },
    {
      day: "Saturday",
      breakfast: ["Banana Pancakes"],
      lunch: ["Tuna Salad", "Crackers"],
      dinner: ["Homemade Pizza", "Veggies"],
    },
    {
      day: "Sunday",
      breakfast: ["French Toast", "Berries"],
      lunch: ["BBQ Chicken", "Mashed Potatoes"],
      dinner: ["Vegetable Lasagna"],
    },
  ];

  const getCurrentMeal = () => {
    const now = new Date();
    const hours = now.getHours();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    
    const todayMeal = meals.find((meal) => meal.day === currentDay);

    if (hours < 10) return { type: "Breakfast", meal: todayMeal.breakfast };
    else if (hours < 15) return { type: "Lunch", meal: todayMeal.lunch };
    else return { type: "Dinner", meal: todayMeal.dinner };
  };

  const [nextMeal, setNextMeal] = useState(getCurrentMeal());
  const [search, setSearch] = useState("");
  const [filteredMeals, setFilteredMeals] = useState(meals);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextMeal(getCurrentMeal());
    }, 60000); // Updates every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter((meal) =>
        Object.values(meal)
          .flat()
          .some((ingredient) =>
            ingredient.toLowerCase().includes(search.toLowerCase())
          )
      );
      setFilteredMeals(filtered);
    }
  }, [search]);

  return (
    <div className="meal-planning">
      <h2 className="title">Weekly Meal Plan</h2>

      <div className="next-meal">
        <h3>Next Meal: {nextMeal.type}</h3>
        <p>{nextMeal.meal.join(", ")}</p>
      </div>

      <input
        type="text"
        placeholder="Search meals by pantry items..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="meal-container">
        {filteredMeals.map((meal, index) => (
          <div className="meal-card" key={index}>
            <h3 className="day">{meal.day}</h3>
            <p><strong>Breakfast:</strong> {meal.breakfast.join(", ")}</p>
            <p><strong>Lunch:</strong> {meal.lunch.join(", ")}</p>
            <p><strong>Dinner:</strong> {meal.dinner.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanning;
