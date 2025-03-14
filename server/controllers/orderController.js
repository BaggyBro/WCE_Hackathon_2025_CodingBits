
const { Order, User, Transaction } = require("../models");
const { updateMarketPrice} = require("../controllers/marketPriceController")


exports.getAllOrders = async (req, res) => {
    try {
        // ✅ Fetch all orders with user info
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ["company_name", "wallet_address"]
                }
            ],
            order: [["createdAt", "DESC"]] // Latest orders first
        });

        res.json({
            message: "✅ All orders fetched successfully",
            total_orders: orders.length,
            orders
        });

    } catch (error) {
        console.error("❌ Error fetching all orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.placeOrder = async (req, res) => {
    try {
        const { wallet_address, order_type, cct_amount, price_per_cct } = req.body;

        // 🛑 Validate request input
        if (!wallet_address || !order_type || !cct_amount || !price_per_cct) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!["BUY", "SELL"].includes(order_type)) {
            return res.status(400).json({ message: "Invalid order type (BUY or SELL)" });
        }

        // ✅ Check if user exists
        const user = await User.findOne({ where: { wallet_address } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Store order in DB with PENDING status
        const order = await Order.create({
            user_id: user.id,
            order_type,
            cct_amount,
            price_per_cct,
            status: "PENDING"
        });

        res.status(201).json({
            message: `✅ ${order_type} order placed successfully`,
            order
        });

    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const { ethers } = require("ethers");

// Setup provider and signer (backend wallet with ETH + allowance)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract info
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const cctABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",   
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, cctABI, signer);

exports.executeBuy = async (req, res) => {
    try {
        const { buyer_wallet_address, order_id } = req.body;

        if (!buyer_wallet_address || !order_id) {
            return res.status(400).json({ message: "Missing buyer wallet address or order ID" });
        }

        const buyer = await User.findOne({ where: { wallet_address: buyer_wallet_address } });
        if (!buyer) return res.status(404).json({ message: "Buyer not found" });

        const sellOrder = await Order.findOne({
            where: { id: order_id, order_type: "SELL", status: "PENDING" }
        });
        if (!sellOrder) return res.status(404).json({ message: "Sell order not found or already completed" });

        const seller = await User.findOne({ where: { id: sellOrder.user_id } });

        const totalEth = parseFloat(sellOrder.cct_amount) * parseFloat(sellOrder.price_per_cct);

        console.log(`💸 Sending ${totalEth} ETH from backend wallet to seller (${seller.wallet_address})`);

        // ETH transfer to seller
        const ethTx = await signer.sendTransaction({
            to: seller.wallet_address,
            value: ethers.parseEther(totalEth.toString())
        });
        await ethTx.wait();

        console.log(`🪙 Transferring ${sellOrder.cct_amount} CCT from seller to buyer`);

        // CCT transfer from seller to buyer via transferFrom (backend must have approval)
        const cctAmountParsed = ethers.parseUnits(sellOrder.cct_amount.toString(), 18);
        const cctTx = await contract.transferFrom(
            seller.wallet_address,      // from
            buyer.wallet_address,       // to
            cctAmountParsed             // amount
        );
        await cctTx.wait();

        // Update Order to COMPLETED
        sellOrder.status = "COMPLETED";
        await sellOrder.save();

        // Log the Transaction
        await Transaction.create({
            buyer_id: buyer.id,
            seller_id: seller.id,
            cct_amount: sellOrder.cct_amount,
            price_per_cct: sellOrder.price_per_cct,
            total_value: totalEth
        });

        await updateMarketPrice();

        res.json({ message: "✅ Purchase successful!", order: sellOrder });

    } catch (error) {
        console.error("❌ Error executing buy:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const backendWalletPrivateKey = process.env.PRIVATE_KEY; // make sure this is set
const backendSigner = new ethers.Wallet(backendWalletPrivateKey, provider);

exports.approveCCT = async (req, res) => {
    try {
        const { seller_private_key, amount } = req.body;

        if (!seller_private_key || !amount) {
            return res.status(400).json({ message: "Missing seller_private_key or amount" });
        }

        // Seller's signer
        const sellerSigner = new ethers.Wallet(seller_private_key, provider);
        const sellerAddress = sellerSigner.address;

        // ✅ Contract with updated ABI (has approve + allowance now!)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, cctABI, sellerSigner);

        const parsedAmount = ethers.parseUnits(amount.toString(), 18);

        console.log(`🚀 Approving ${parsedAmount} CCT from ${sellerAddress} to ${backendSigner.address}`);


        const approveTx = await contract.approve(backendSigner.address, parsedAmount);

        await approveTx.wait();

        const allowance = await contract.allowance(sellerAddress, backendSigner.address);


        res.json({
            message: `✅ Approved ${ethers.formatUnits(allowance, 18)} CCT from seller to backend`,
            seller: sellerAddress,
            backend: backendSigner.address,
            allowance: ethers.formatUnits(allowance, 18)
        });

    } catch (error) {
        console.error("❌ Error approving CCT:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


