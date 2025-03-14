
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Bid = sequelize.define("Bid", {
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    buyer_id: { type: DataTypes.INTEGER, allowNull: false },
    bid_price: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    cct_amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "PENDING" }
});

module.exports = Bid;
