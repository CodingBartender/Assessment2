// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// CRUD for portfolios (restricted to logged-in buyer)
router.post('/', portfolioController.createPortfolio); // create portfolio
router.get('/', portfolioController.getPortfolios); // get all portfolios
router.get('/:id', portfolioController.getPortfolioById); // get portfolio by id
router.put('/:id', portfolioController.updatePortfolio); // update portfolio
router.delete('/:id', portfolioController.deletePortfolio); // delete portfolio
//router.get('/:id/stocks', portfolioController.getStocksInPortfolio); // get stocks in portfolio

module.exports = router;
