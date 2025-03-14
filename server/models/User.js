

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    company_name: { type: DataTypes.STRING, allowNull: false },
    wallet_address: { type: DataTypes.STRING, allowNull: false, unique: true },
    private_key: { type: DataTypes.TEXT, allowNull: false }, // Encrypt this!
});

module.exports = User;
