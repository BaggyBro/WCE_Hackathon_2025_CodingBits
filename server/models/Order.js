
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: User, key: "id" } 
    },
    order_type: { 
        type: DataTypes.ENUM("BUY", "SELL"), 
        allowNull: false 
    },
    cct_amount: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
    price_per_cct: { type: DataTypes.DECIMAL(18, 8), allowNull: false }, // Price per token
    status: { 
        type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED"), 
        defaultValue: "PENDING" 
    },
    expires_at: { 
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Order;
