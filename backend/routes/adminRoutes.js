const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");

router.get("/users", async (req, res) => {
  const users = await admin.getAllUsers();
  res.json(users);
});

router.post("/users", async (req, res) => {
  const user = await admin.createUser(req.body);
  res.status(201).json(user);
});

router.delete("/users/:id", async (req, res) => {
  const deleted = await admin.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
});

router.get("/stocks", async (req, res) => {
  const stocks = await admin.getAllStocks();
  res.json(stocks);
});

router.post("/stocks", async (req, res) => {
  const stock = await admin.createStock(req.body);
  res.status(201).json(stock);
});

router.delete("/stocks/:id", async (req, res) => {
  const deleted = await admin.deleteStock(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Stock not found" });
  res.json({ message: "Stock deleted" });
});


module.exports = router;
