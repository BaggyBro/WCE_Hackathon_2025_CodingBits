
const { ethers } = require("ethers");
const { Order } = require("../models");

require("dotenv").config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); 
const privateKey = process.env.PRIVATE_KEY; 
const wallet = new ethers.Wallet(privateKey, provider);

const CCT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const CCT_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)"
];

const cctContract = new ethers.Contract(CCT_ADDRESS, CCT_ABI, wallet);

// 🔹 Approve CCT Tokens
exports.approveTokens = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ message: "Missing amount" });

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    
    console.log(`🔹 Approving ${amount} CCT for marketplace contract...`);
    const tx = await cctContract.approve(CCT_ADDRESS, amountParsed);
    await tx.wait();

    console.log("✅ Approval successful");
    res.json({ message: "Approval successful" });

  } catch (error) {
    console.error("❌ Error approving tokens:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// 🔹 Create a Sell Order

const moment = require("moment");
const { User } = require("../models");

exports.createSellOrder = async (req, res) => {
  try {
    const { wallet_address, price_per_cct, cct_amount } = req.body;

    if (!wallet_address || !price_per_cct || !cct_amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const seller = await User.findOne({ where: { wallet_address } });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const expires_at = moment().add(2, "minutes").toISOString(); // ✅ Expires in 2 minutes

    const newOrder = await Order.create({
      user_id: seller.id,
      order_type: "SELL",
      price_per_cct,
      cct_amount,
      expires_at,
      status: "PENDING"
    });

    res.json({ message: "✅ Sell Order Created", order: newOrder });

  } catch (error) {
    console.error("❌ Error creating sell order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

