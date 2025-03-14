
const sequelize = require("../config/database");
const User = require("./User");
const Order = require("./Order");
const MarketPrice = require("./MarketPrice");
const Transaction = require("./Transaction");
const Bid = require("./Bid");  // ✅ Import Bid model

// Relationships
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Transaction, { foreignKey: "buyer_id" });
User.hasMany(Transaction, { foreignKey: "seller_id" });
Transaction.belongsTo(User, { as: "Buyer", foreignKey: "buyer_id" });
Transaction.belongsTo(User, { as: "Seller", foreignKey: "seller_id" });

// ✅ Define Bid relationships
User.hasMany(Bid, { foreignKey: "buyer_id" });
Bid.belongsTo(User, { foreignKey: "buyer_id" });

Order.hasMany(Bid, { foreignKey: "order_id" });
Bid.belongsTo(Order, { foreignKey: "order_id" });

// ✅ Sync database
sequelize.sync({ alter: true })
    .then(() => console.log("✅ Database & tables synced"))
    .catch(error => console.error("❌ Database sync error:", error));

// ✅ Export all models
module.exports = { User, Order, MarketPrice, Transaction, Bid }; 

