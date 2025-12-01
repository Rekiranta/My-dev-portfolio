const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "Example Product", sku: "EX-001", quantity: 10, price: 19.99 },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { name, sku, quantity, price } = req.body;
  const newProduct = {
    id: Date.now(),
    name,
    sku,
    quantity,
    price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Inventory backend running on port ${PORT}`);
});
