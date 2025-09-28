// controllers/portfolioController.js
const portfolioRepo = require('../repository/portfolioRepositry');

exports.createPortfolio = async (req, res) => {
  try {
    // Use user_id from req.body if req.user is not set
    const buyer_id = req.user?.user_id || req.body.user_id;
    if (!buyer_id) {
      return res.status(400).json({ error: 'buyer_id (user_id) is required' });
    }
    const portfolioData = { ...req.body, buyer_id };
    const portfolio = await portfolioRepo.createPortfolio(portfolioData);
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPortfolios = async (req, res) => {
  try {
    const user_id = req.user?.id || req.body.user_id || req.query.user_id;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const portfolios = await portfolioRepo.getPortfoliosByUser(user_id);
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const user_id = req.params.id; // get user_id from route param
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const portfolio = await portfolioRepo.getPortfolioById(user_id, user_id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const buyerId = req.user?.id || req.body.buyer_id || req.body.user_id || req.query.buyer_id || req.query.user_id;
    if (!buyerId) {
      return res.status(400).json({ error: 'buyer_id (user_id) is required' });
    }
    const portfolio = await portfolioRepo.updatePortfolio(req.params.id, buyerId, req.body);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found or not yours' });
    res.json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const user_id = req.user?.id || req.body.user_id || req.query.user_id;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const portfolio = await portfolioRepo.deletePortfolio(req.params.id, user_id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found or not yours' });
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
