const express = require("express");
const router = express.Router();
const orderStatusController = require("../controllers/orderStatusController");

router.put("/:id/status", orderStatusController.updateOrderStatus);

module.exports = router;
