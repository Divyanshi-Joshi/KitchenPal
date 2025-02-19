// FoodImageService.js
const FOOD_IMAGES = {
    // Dairy
    'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d',
    'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
    'cream': 'https://images.unsplash.com/photo-1557170334-a9632d3bba5c',
    
    // Fruits
    'apple': 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    'orange': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9',
    'grape': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f',
    'strawberry': 'https://images.unsplash.com/photo-1518635017480-d9d458143a41',
    
    // Vegetables
    'tomato': 'https://images.unsplash.com/photo-1561136594-7f68413baa99',
    'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1',
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510',
    
    // Meat
    'chicken': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781',
    'beef': 'https://images.unsplash.com/photo-1603048297172-c85dae968742',
    'fish': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62',
    'pork': 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6',
    'lamb': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143',
    
    // Beverages
    'water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d',
    'juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    'soda': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
  };
  
  export class FoodImageService {
    static UNSPLASH_ACCESS_KEY = 'API KEY'; // Replace with your key
    
    static async getImage(itemName) {
      // First check our predefined mapping
      const mappedImage = this.getMappedImage(itemName);
      if (mappedImage) return mappedImage;
      
      // If no mapping found, try Unsplash
      return await this.getUnsplashImage(itemName);
    }
    
    static getMappedImage(itemName) {
      const lowercaseName = itemName.toLowerCase();
      
      // Check exact match
      if (FOOD_IMAGES[lowercaseName]) {
        return FOOD_IMAGES[lowercaseName];
      }
      
      // Check partial matches
      const matchingKey = Object.keys(FOOD_IMAGES).find(key => 
        lowercaseName.includes(key) || key.includes(lowercaseName)
      );
      
      return matchingKey ? FOOD_IMAGES[matchingKey] : null;
    }
    
    static async getUnsplashImage(itemName) {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${itemName}+food&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${this.UNSPLASH_ACCESS_KEY}`
            }
          }
        );
        const data = await response.json();
        return data.results[0]?.urls?.regular || '/default-food-image.png';
      } catch (error) {
        console.error('Error fetching image:', error);
        return '/default-food-image.png';
      }
    }
  }
