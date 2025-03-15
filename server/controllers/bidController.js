
const {Bid, User, Order} = require("../models")


exports.placeBid = async (req, res) => {
    try {
        const { order_id, buyer_id, bid_price, cct_amount } = req.body;

        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (new Date() > new Date(order.expires_at)) {
            return res.status(400).json({ message: "Order has already expired" });
        }

        const newBid = await Bid.create({
            order_id,
            buyer_id,
            bid_price,
            cct_amount
        });

        res.json({ message: "Bid placed successfully", bid: newBid });
    } catch (error) {
        console.error("❌ Error placing bid:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.viewBids = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ message: "Missing order ID" });
        }

        const bids = await Bid.findAll({
            where: { order_id, status: "PENDING" },
            order: [["bid_price", "DESC"]],
            include: [
                {
                    model: User,
                    attributes: ["wallet_address"], // Get only wallet_address
                    as: "User" // ⚠️ This must match the alias in Bid.belongsTo(User, { foreignKey: "buyer_id" })
                }
            ]
        });

        res.json({ bids });

    } catch (error) {
        console.error("❌ Error fetching bids:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getBidsByWallet = async (req, res) => {
    try {
        const { wallet_address } = req.body; // Get wallet_address from query params

        if (!wallet_address) {
            return res.status(400).json({ message: "Missing wallet address" });
        }

        // Find user by wallet address
        const user = await User.findOne({
            where: { wallet_address }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all bids placed by this user
        const bids = await Bid.findAll({
            where: { buyer_id: user.id }, // Match user's ID
            include: [
                {
                    model: Order,
                    attributes: ["order_type", "price_per_cct", "status"], // Include order details
                }
            ],
            order: [["bid_price", "DESC"]] // Order by highest bid first
        });

        res.json({ bids });

    } catch (error) {
        console.error("❌ Error fetching bids by wallet:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


