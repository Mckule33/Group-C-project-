
require('dotenv').config({path: './.env'})
const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

//List of products in a boba shop---in memory database
let products = [ 
  { id: 1, product : 'banana flavor', sold: 10, available: 10 }, 
  { id: 2, product : 'fresh milk', sold: 5, available: 15},
  { id: 3, product : 'brown sugar', sold: 20, available: 0},
  { id: 4, product : ' Mango & pineapple', sold: 18, available: 2}
];


// Get All Products 
app.get('/products', (req, res) => {
  res.status(200).json({ count: products.length, products });
});


// Get---Number of products sold
app.get('/products/sold', (req, res) => {
  const productsSold = products.reduce((sum, product) => sum + product.sold, 0);

  res.json({ productsSold });
})



//GET -- products still in stock - Read
app.get('/products/available', (req, res) => {
    const availableProducts = products.filter((p) => p.available !== 0);
    if (availableProducts.length === 0)
        return res.status(404).json({ message: 'store out of stock'});
    res.status(200).json(availableProducts);
});



// Get individual products by ID
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found'});
  }
  res.json(product);
});


//Post-- Add new product to store
app.post('/products', (req, res) => {
  const { product, sold, available } = req.body;
   if (typeof product !== 'string' || typeof sold !== 'number' || typeof available !== 'number') {
      return res.status(400).json({ error: 'Invalid entry: provide a valid product and availability status'}); 
   }
  const newProduct = { id: products.length + 1, product, sold, available }; // Auto-ID
  products.push(newProduct);
  res.status(201).json(newProduct); // Echo back 
});


// PATCH--- Updating product info
app.patch('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id)); // Array.find()--Find particular products to edit
  if (!product) return res.status(404).json({ message: 'product not found' });
  Object.assign(product, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(product);
});


// DELETE Remove
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter((t) => t.id !== id); // Array.filter() – to find product to be deleted
  if (products.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});


app.listen(PORT, () => console.log(`Server is live on port ${PORT}`));