
const { ethers } = require("ethers");
const { User } = require("../models");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractABI = require("/home/baggybro/skills/soft/WCE_Hack/blockchain/artifacts/contracts/carbonCreditToken.sol/CarbonCreditToken.json").abi;
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

const executeTransaction = async (order, highestBid) => {
  try {
    const seller = await User.findByPk(order.user_id);
    const buyer = await User.findByPk(highestBid.buyer_id);

    if (!seller || !buyer) {
      console.error("❌ Seller or Buyer not found");
      return false;
    }

    console.log(`🔹 Processing transaction: ${buyer.wallet_address} → ${seller.wallet_address}`);

    // ✅ Send CCT tokens from seller to buyer
    const tx = await contract.transferFrom(
      seller.wallet_address,
      buyer.wallet_address,
      ethers.parseEther(order.cct_amount.toString())
    );

    await tx.wait();

    console.log("✅ Transaction Successful!");
    return true;
  } catch (error) {
    console.error("❌ Transaction Failed:", error);
    return false;
  }
};

module.exports = { executeTransaction };
