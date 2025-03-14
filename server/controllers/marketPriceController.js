
const { Transaction, MarketPrice } = require("../models");
const { Op } = require("sequelize");

// 📊 **Calculate & Update Market Price**
exports.updateMarketPrice = async () => {
    try {
        // Fetch last 20 completed transactions (or last 7 days)
        const transactions = await Transaction.findAll({
            where: { createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        // Calculate Weighted Average Price
        let totalCCT = 0, totalValue = 0;
        transactions.forEach(tx => {
            totalCCT += parseFloat(tx.cct_amount);
            totalValue += parseFloat(tx.total_value);
        });

        const marketPrice = totalCCT > 0 ? (totalValue / totalCCT) : 0;

        // Store in MarketPrice table
        await MarketPrice.create({ price_per_cct: marketPrice });

        console.log(`✅ Market Price Updated: ${marketPrice.toFixed(8)} ETH/CCT`);
        return marketPrice;

    } catch (error) {
        console.error("❌ Error in market price calculation:", error);
    }
};


exports.getMarketPrice = async (req, res) => {
    try {
        // Get latest market price
        const latestPrice = await MarketPrice.findOne({ order: [['timestamp', 'DESC']] });

        if (!latestPrice) return res.status(404).json({ message: "Market price not available" });

        res.json({ market_price: latestPrice.price_per_cct.toFixed(8) + " ETH/CCT" });

    } catch (error) {
        console.error("❌ Error fetching market price:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
