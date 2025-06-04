# Smart Kitchen Management System 🍳

An AI-powered kitchen management system built with React that helps you manage your kitchen inventory, plan meals, track food waste and create smart grocery lists.

## 🌟 Key Features

### 1. Smart Fridge Management
- Track food items with expiry dates
- Automatic image fetching for food items
- Visual expiry date indicators (Red: Expired, Yellow: Warning, Green: Good)
- Category-based organization (Dairy, Vegetables, Fruits, Meat, etc.)
- Real-time search and filtering capabilities

### 2. AI-Powered Grocery List
- Smart grocery list generation
- AI-suggested items based on your inventory
- Automatic price estimation
- Generate grocery lists from dish names
- Real-time cost tracking
- Check/uncheck items functionality

### 3. Meal Planning
- Weekly meal planning interface
- Dietary preference filters (Vegetarian, Vegan, Gluten-Free, etc.)
- Search functionality for ingredients
- Beautiful meal cards with breakfast, lunch, and dinner options
- Tag-based meal organization

### 4. Food Waste Tracking
- Visual waste distribution charts
- Weekly waste tracking
- Category-based waste analysis
- Expired items monitoring
- Waste reduction insights
- Interactive pie charts for waste distribution

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Unsplash API key (for food images)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/kitchen-management-system.git
cd kitchen-management-system
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory and add your configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

4. Start the development server
```bash
npm start
# or
yarn start
```
