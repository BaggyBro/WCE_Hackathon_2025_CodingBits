
const {Bid, User, Order} = require("../models")

exports.placeBid = async (req, res) => {
    try {
        const { buyer_wallet_address, order_id, bid_price, cct_amount } = req.body;

        if (!buyer_wallet_address || !order_id || !bid_price || !cct_amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const buyer = await User.findOne({ where: { wallet_address: buyer_wallet_address } });
        if (!buyer) return res.status(404).json({ message: "Buyer not found" });

        const sellOrder = await Order.findOne({
            where: { id: order_id, order_type: "SELL", status: "PENDING" }
        });
        if (!sellOrder) return res.status(404).json({ message: "Sell order not found or already completed" });

        const bid = await Bid.create({
            order_id,
            buyer_id: buyer.id,
            bid_price,
            cct_amount
        });

        res.json({ message: "✅ Bid placed successfully!", bid });

    } catch (error) {
        console.error("❌ Error placing bid:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.acceptBid = async (req, res) => {
    try {
        const { seller_wallet_address, order_id } = req.body;

        if (!seller_wallet_address || !order_id) {
            return res.status(400).json({ message: "Missing seller wallet address or order ID" });
        }

        const seller = await User.findOne({ where: { wallet_address: seller_wallet_address } });
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        const sellOrder = await Order.findOne({
            where: { id: order_id, user_id: seller.id, order_type: "SELL", status: "PENDING" }
        });
        if (!sellOrder) return res.status(404).json({ message: "Sell order not found or already completed" });

        // Get the highest bid
        const highestBid = await Bid.findOne({
            where: { order_id, status: "PENDING" },
            order: [["bid_price", "DESC"]]
        });

        if (!highestBid) return res.status(404).json({ message: "No bids found for this order" });

        const buyer = await User.findOne({ where: { id: highestBid.buyer_id } });

        console.log(`💸 Transferring ${highestBid.bid_price * highestBid.cct_amount} ETH to seller`);

        // ETH transfer from buyer to seller
        const ethTx = await signer.sendTransaction({
            to: seller.wallet_address,
            value: ethers.parseEther((highestBid.bid_price * highestBid.cct_amount).toString())
        });
        await ethTx.wait();

        console.log(`🪙 Transferring ${highestBid.cct_amount} CCT from seller to buyer`);

        // Transfer CCT from seller to buyer
        const cctAmountParsed = ethers.parseUnits(highestBid.cct_amount.toString(), 18);
        const cctTx = await contract.transferFrom(
            seller.wallet_address,
            buyer.wallet_address,
            cctAmountParsed
        );
        await cctTx.wait();

        // Update order & bid status
        sellOrder.status = "COMPLETED";
        await sellOrder.save();

        highestBid.status = "ACCEPTED";
        await highestBid.save();

        res.json({ message: "✅ Bid accepted successfully!", order: sellOrder, bid: highestBid });

    } catch (error) {
        console.error("❌ Error accepting bid:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.viewBids = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            console.log(order_id)
            return res.status(400).json({ message: "Missing order ID" });
        }

        const bids = await Bid.findAll({
            where: { order_id, status: "PENDING" },
            order: [["bid_price", "DESC"]]
        });

        res.json({ bids });

    } catch (error) {
        console.error("❌ Error fetching bids:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
