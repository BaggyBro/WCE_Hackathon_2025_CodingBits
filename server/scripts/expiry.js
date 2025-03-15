
const { Op } = require("sequelize");
const { Order, Bid, User } = require("../models");
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const contractABI = require("/home/baggybro/skills/soft/WCE_Hack/blockchain/artifacts/contracts/carbonCreditToken.sol/CarbonCreditToken.json").abi;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

async function checkAndMarkExpiredOrders() {
  console.log("🔍 Checking for expired orders...");

  const expiredOrders = await Order.findAll({
    where: {
      expires_at: { [Op.lt]: new Date().toISOString().slice(0, 19).replace("T", " ") },
      status: "PENDING",
    },
  });

  console.log(expiredOrders);

  for (const order of expiredOrders) {
    console.log(`⏳ Order ${order.id} expired. Checking highest bidder...`);

    const highestBid = await Bid.findOne({
      where: { order_id: order.id },
      order: [["bid_price", "DESC"]], // Sort bids by highest price
    });

    if (highestBid) {
      console.log(`✅ Highest bid found from Buyer ${highestBid.buyer_id}. Processing transaction...`);

      const seller = await User.findByPk(order.user_id);
      const buyer = await User.findByPk(highestBid.buyer_id);

      if (!seller || !buyer) {
        console.error("❌ Seller or Buyer not found, skipping transaction.");
        continue;
      }

      try {
        // 🔹 Transfer ETH from Buyer to Seller
        const txEth = await wallet.sendTransaction({
          to: seller.wallet_address,
          value: ethers.parseEther(highestBid.bid_price.toString()),
        });
        await txEth.wait();
        console.log(`💰 ETH Transfer Success: ${txEth.hash}`);

        // 🔹 Transfer CCT Tokens from Seller to Buyer
        const txCCT = await contract.transferFrom(
          seller.wallet_address,
          buyer.wallet_address,
          ethers.parseEther(order.cct_amount.toString())
        );
        await txCCT.wait();
        console.log(`✅ CCT Transfer Success: ${txCCT.hash}`);

        // 🔹 Mark Order & Bid as Completed
        await order.update({ status: "COMPLETED" });
        await highestBid.update({ status: "ACCEPTED" });

      } catch (error) {
        console.error("❌ Transaction Failed:", error);
        continue;
      }

    } else {
      console.log(`❌ No bids for Order ${order.id}. Marking as EXPIRED.`);
      await order.update({ status: "EXPIRED" });
    }
  }
}

// ✅ Run check every 10 seconds
setInterval(checkAndMarkExpiredOrders, 10000);

module.exports = { checkAndMarkExpiredOrders };

