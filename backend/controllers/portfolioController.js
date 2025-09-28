// controllers/portfolioController.js
const portfolioRepo = require('../repository/portfolioRepositry');

exports.createPortfolio = async (req, res) => {
  try {
    const portfolioData = { ...req.body, buyer_id: req.user.id }; // assume req.user is set by auth middleware
    const portfolio = await portfolioRepo.createPortfolio(portfolioData);
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPortfolios = async (req, res) => {
  try {
    const portfolios = await portfolioRepo.getPortfoliosByUser(req.user.id);
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await portfolioRepo.getPortfolioById(req.params.id, req.user.id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioRepo.updatePortfolio(req.params.id, req.user.id, req.body);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found or not yours' });
    res.json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioRepo.deletePortfolio(req.params.id, req.user.id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found or not yours' });
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
