const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

//List of products in a boba shop---in memory database
let products = [ 
  { id: 1, prodcut : 'banana flavor', Sold: 10, left: 10 }, 
  { id: 2, product : 'fresh milk', sold: 5, left: 15},
  { id: 3, product : 'brwon sugar', sold: 7, left :13},
];


// Get All Products
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

// Get individual ID's
app.get('/api/products/:id', (req, res) => {
  const product = products.find(product => product.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found'});
  }
  res.json({ success: true, data: product });
})