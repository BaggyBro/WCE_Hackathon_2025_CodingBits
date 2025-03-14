

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Transaction = sequelize.define("Transaction", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    buyer_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: "id" } 
    },
    seller_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: "id" } 
    },
    cct_amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    price_per_cct: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    total_value: { type: DataTypes.DECIMAL(18, 8), allowNull: false }, // Total cost in ETH
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Transaction;
