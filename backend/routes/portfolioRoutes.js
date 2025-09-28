// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// CRUD for portfolios (restricted to logged-in buyer)
router.post('/addPortfolio', portfolioController.createPortfolio); // create portfolio
router.get('/getAllByUserId', portfolioController.getPortfolios); // get all portfolios
router.get('/getById/:id', portfolioController.getPortfolioById); // get portfolio by id
router.put('/update/:id', portfolioController.updatePortfolio); // update portfolio
router.delete('/delete/:id', portfolioController.deletePortfolio); // delete portfolio
//router.get('/getStocks/:id/stocks', portfolioController.getStocksInPortfolio); // get stocks in portfolio

module.exports = router;
