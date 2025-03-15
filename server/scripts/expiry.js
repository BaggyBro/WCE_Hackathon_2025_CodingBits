
const { Order, Bid, User } = require("../models");
const { Op } = require("sequelize");
const { executeTransaction } = require("../utils/transaction");

const checkAndRemoveExpiredOrders = async () => {
  try {
    const expiredOrders = await Order.findAll({
      where: {
        expires_at: { [Op.lte]: new Date() }, // Orders with expiry time <= now
        status: "PENDING",
      },
      include: [{ model: Bid, required: false, order: [["bid_price", "DESC"]], limit: 1 }],
    });

    for (const order of expiredOrders) {
      const highestBid = order.Bids.length > 0 ? order.Bids[0] : null;

      if (highestBid) {
        // ✅ Process transaction if there is a highest bidder
        const success = await executeTransaction(order, highestBid);

        if (success) {
          await order.update({ status: "COMPLETED" });
          await highestBid.update({ status: "ACCEPTED" });
        } else {
          await order.update({ status: "CANCELLED" });
        }
      } else {
        // ❌ No bids, just mark as expired
        await order.update({ status: "CANCELLED" });
      }
    }
  } catch (error) {
    console.error("❌ Error checking expired orders:", error);
  }
};

setInterval(checkAndRemoveExpiredOrders, 10000);

module.exports = { checkAndRemoveExpiredOrders };

