
require("dotenv").config();
const { ethers } = require("ethers");

// ✅ Connect to Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// ✅ Signer - deployer wallet (use your private key)
const PRIVATE_KEY = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE";
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Contract details
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "YOUR_CONTRACT_ADDRESS_HERE";

// ✅ Basic ABI for the contract (balanceOf + transfer)
const cctABI = [
    "function balanceOf(address) public view returns (uint256)",
    "function transfer(address recipient, uint256 amount) public returns (bool)"
];

// ✅ Contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, cctABI, signer);

// ✅ Token price (1 CCT = 0.01 ETH)
const PRICE_PER_TOKEN = 0.01;

/**
 * ✅ Buy Tokens Controller
 * Buyer pays ETH -> receives CCT
 */
exports.buyTokens = async (req, res) => {
    try {
        const { buyer, ethAmount } = req.body;

        if (!buyer || !ethAmount) {
            return res.status(400).json({ message: "Missing buyer address or ETH amount" });
        }

        const cctAmount = ethAmount / PRICE_PER_TOKEN;

        console.log(`➡️ Buying: ${cctAmount} CCT for ${ethAmount} ETH, sending to ${buyer}`);

        const tx = await contract.transfer(buyer, ethers.parseUnits(cctAmount.toString(), 18));
        await tx.wait();

        res.json({ message: `✅ Sent ${cctAmount} CCT to ${buyer}` });

    } catch (error) {
        console.error("❌ Error in buyTokens:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * ✅ Sell Tokens Controller
 * Seller returns CCT -> receives ETH
 */
exports.sellTokens = async (req, res) => {
    try {
        const { seller, cctAmount } = req.body;

        if (!seller || !cctAmount) {
            return res.status(400).json({ message: "Missing seller address or CCT amount" });
        }

        const ethAmount = cctAmount * PRICE_PER_TOKEN;

        console.log(`➡️ Selling: ${cctAmount} CCT for ${ethAmount} ETH, sending to ${seller}`);

        const tx = await signer.sendTransaction({
            to: seller,
            value: ethers.parseEther(ethAmount.toString())
        });
        await tx.wait();

        res.json({ message: `✅ Sent ${ethAmount} ETH to ${seller}` });

    } catch (error) {
        console.error("❌ Error in sellTokens:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



