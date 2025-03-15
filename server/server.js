require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const fs = require("fs");
const {User, Order, MarketPrice, Transaction } = require("./models");
const router = require('./routes/routes')
const { checkAndRemoveExpiredOrders} = require("./scripts/expiry")

const app = express();
app.use(express.json());
app.use(cors());
app.use('', router)

// ✅ Load environment variables
const PORT =  3999;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("❌ Missing required environment variables in .env");
    process.exit(1);
}

// ✅ Load contract ABI (Ensure correct path)
const ABI_PATH = "../blockchain/artifacts/contracts/carbonCreditToken.sol/CarbonCreditToken.json";
if (!fs.existsSync(ABI_PATH)) {
    console.error("❌ ABI file missing. Ensure correct contract compilation.");
    process.exit(1);
}
const contractABI = JSON.parse(fs.readFileSync(ABI_PATH, "utf8")).abi;

// ✅ Connect to Blockchain
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

setInterval(checkAndRemoveExpiredOrders, 10000);
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});


