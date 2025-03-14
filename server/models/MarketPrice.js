
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MarketPrice = sequelize.define("MarketPrice", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    price_per_cct: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = MarketPrice;
