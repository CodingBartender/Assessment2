// repositories/portfolioRepository.js
const Portfolio = require('../models/Portfolio');

class PortfolioRepository {
    async createPortfolio(portfolioData) {
        const portfolio = new Portfolio(portfolioData);
        return await portfolio.save();
    }

    async getPortfoliosByUser(userId) {
        return await Portfolio.find({ buyer_id: userId });
    }

    async getPortfolioById(portfolioId, userId) {
        return await Portfolio.findOne({ _id: portfolioId, buyer_id: userId });
    }

    async updatePortfolio(portfolioId, userId, updateData) {
        return await Portfolio.findOneAndUpdate(
            { _id: portfolioId, buyer_id: userId },
            updateData,
            { new: true }
        );
    }

    async deletePortfolio(portfolioId, userId) {
        return await Portfolio.findOneAndDelete({ _id: portfolioId, buyer_id: userId });
    }

    // Methods to adjust virtual balance
    async decreaseBalance(portfolioId, amount) {
        return await Portfolio.findOneAndUpdate(
            { _id: portfolioId },
            { $inc: { virtual_balance: -amount } },
            { new: true }
        );
    }

    async increaseBalance(portfolioId, amount) {
        return await Portfolio.findOneAndUpdate(
            { _id: portfolioId },
            { $inc: { virtual_balance: amount } },
            { new: true }
        );
    }

}


module.exports = new PortfolioRepository();
