const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: 'YOUR_API_KEY'
});

// Generate AI suggestions
// In routes/ai.js
router.get('/suggestions', async (req, res) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a grocery suggestion system. Generate 5 common grocery items that might be needed. STRICTLY follow this format for EACH line: 'ItemName | Quantity | Unit | Price | Reason'. Example: 'Milk | 1 | L | 65 | Running low based on weekly usage'. NO explanations, NO extra text, NO thinking out loud."
          },
          {
            role: "user",
            content: "Generate 5 grocery suggestions with quantities, prices in INR, and reasons for purchase."
          }
        ],
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.6,
        max_completion_tokens: 1000,
        top_p: 0.95,
        stream: false
      });
  
      const suggestions = chatCompletion.choices[0].message.content
        .split('\n')
        .filter(line => {
          const cleanLine = line.trim();
          return (
            cleanLine !== '' && 
            cleanLine.includes('|') && 
            !cleanLine.toLowerCase().includes('think') &&
            !cleanLine.toLowerCase().includes('let me') &&
            !cleanLine.toLowerCase().includes('format') &&
            !cleanLine.match(/^I |^The |^Here|^Now/)
          );
        })
        .map(line => {
          const [name, quantity, unit, price, ...reasonParts] = line.split('|').map(item => item.trim());
          return {
            name,
            quantity: parseFloat(quantity) || 1,
            unit: unit || 'piece',
            price: parseFloat(price.replace(/[^\d.]/g, '')) || 0,
            reason: reasonParts.join('|').trim()
          };
        })
        .filter(item => item.name && item.price > 0 && item.reason);
  
      res.json(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      res.status(500).json({ error: 'Failed to generate suggestions' });
    }
  });

// Get price estimate
router.get('/price-estimate/:item', async (req, res) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a price estimator. Respond with ONLY the estimated price in INR as a number."
        },
        {
          role: "user",
          content: `What is the estimated price in INR for: ${req.params.item}?`
        }
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.3,
      max_completion_tokens: 50,
      top_p: 0.95,
      stream: false
    });

    const price = parseFloat(chatCompletion.choices[0].message.content.trim());
    res.json({ price });
  } catch (error) {
    console.error('Error estimating price:', error);
    res.status(500).json({ error: 'Failed to estimate price' });
  }
});

// Generate dish ingredients
// In routes/ai.js
router.post('/dish-ingredients', async (req, res) => {
    try {
      const { dish } = req.body;
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a grocery list generator. Generate ingredients with their prices in INR. STRICTLY follow this format for EACH line: 'ItemName | Quantity | Unit | Price'. Example: 'Rice | 1 | kg | 90'. NO explanations, NO extra text, NO thinking out loud."
          },
          {
            role: "user",
            content: `List all ingredients needed for ${dish} with their quantities and prices in INR.`
          }
        ],
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.6,
        max_completion_tokens: 1000,
        top_p: 0.95,
        stream: false
      });
  
      const ingredients = chatCompletion.choices[0].message.content
        .split('\n')
        .filter(line => {
          const cleanLine = line.trim();
          return (
            cleanLine !== '' && 
            cleanLine.includes('|') && 
            !cleanLine.toLowerCase().includes('think') &&
            !cleanLine.toLowerCase().includes('let me') &&
            !cleanLine.toLowerCase().includes('format') &&
            !cleanLine.match(/^I |^The |^Here|^Now/)
          );
        })
        .map(line => {
          const [name, quantity, unit, price] = line.split('|').map(item => item.trim());
          return {
            name,
            quantity: parseFloat(quantity) || 1,
            unit: unit || 'piece',
            price: parseFloat(price.replace(/[^\d.]/g, '')) || 0
          };
        })
        .filter(item => item.name && item.price > 0);
  
      res.json(ingredients);
    } catch (error) {
      console.error('Error generating ingredients:', error);
      res.status(500).json({ error: 'Failed to generate ingredients' });
    }
  });
  
module.exports = router;
