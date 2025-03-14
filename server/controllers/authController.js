
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const { User } = require("../models");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const signer = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", 
    provider
); 

const cctABI = [ "function transfer(address recipient, uint256 amount) public returns (bool)" ];
const cctAddress = process.env.CONTRACT_ADDRESS; 

const createWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    console.log(`✅ Wallet Created: ${wallet.address}`);
    return wallet;
};


const fundWallet = async (recipient) => {
    if (!recipient || !ethers.isAddress(recipient)) {
        console.error("❌ Invalid recipient address:", recipient);
        return;
    }

    console.log(`Funding ETH & CCT to: ${recipient}`);

    try {
        const cct = new ethers.Contract(cctAddress, cctABI, signer);

        const cctAmount = ethers.parseUnits("100", 18); // 100 CCT
        const ethAmount = ethers.parseEther("5");
        // ✅ Send ETH
        const ethTx = await signer.sendTransaction({
            to: recipient,
            value: ethAmount
        });
        await ethTx.wait();

        // ✅ Send CCT
        const cctTx = await cct.transfer(recipient, cctAmount);
        await cctTx.wait();

    } catch (error) {
        console.error("❌ Error in funding wallet:", error);
    }
};

exports.register = async (req, res) => {
    try {
        const { company_name, email, password } = req.body;

        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create Ethereum Wallet
        const wallet = ethers.Wallet.createRandom();

        console.log(`✅ New Wallet Created: ${wallet.address}`);

        // ✅ Store User in DB
        user = await User.create({
            company_name,
            email,
            password: hashedPassword,
            wallet_address: wallet.address,
            private_key: wallet.privateKey, // ⚠️ Consider encrypting this!
        });

        // ✅ Fund User's Wallet with ETH & CCT
        await fundWallet(wallet.address);

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "User registered successfully",
            token,
            wallet_address: wallet.address
        });

    } catch (error) {
        console.error("❌ Error in register:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // ✅ Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, wallet_address: user.wallet_address },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            wallet_address: user.wallet_address,
            company_name: user.company_name
        });

    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.checkWalletBalance = async (req, res) => {
    try {

        const {wallet_address} = req.body;

        // ✅ Check ETH balance
        const ethBalance = await provider.getBalance(wallet_address);
        const formattedEthBalance = ethers.formatEther(ethBalance) + " ETH";

        // ✅ Check CCT Token Balance
        const cctABI = ["function balanceOf(address) view returns (uint256)"];
        const cctAddress = process.env.CONTRACT_ADDRESS; // Replace with your contract address
        const cctContract = new ethers.Contract(cctAddress, cctABI, provider);

        const cctBalance = await cctContract.balanceOf(wallet_address);
        const formattedCctBalance = ethers.formatUnits(cctBalance, 18) + " CCT";

        res.json({
            wallet_address,
            eth_balance: formattedEthBalance,
            cct_balance: formattedCctBalance
        });

    } catch (error) {
        console.error("❌ Error in checkWalletBalance:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

