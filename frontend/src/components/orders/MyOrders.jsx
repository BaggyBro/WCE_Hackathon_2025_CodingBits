import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [approved, setApproved] = useState(false);

  // Load Wallet Address from LocalStorage
  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet_address");
    if (storedWallet) setWalletAddress(storedWallet);
  }, []);

  // 🔹 Approve Tokens (API Call)
  const approveTokens = async () => {
    try {
      const response = await axios.post("http://localhost:3999/approve", { amount });
      alert(response.data.message);
      setApproved(true);
    } catch (error) {
      console.error("❌ Error approving tokens:", error);
      alert("Failed to approve tokens");
    }
  };

  // 🔹 Place Sell Order (API Call)
  const placeSellOrder = async () => {
    if (!approved) return alert("Approve tokens first");
    if (!walletAddress) return alert("No wallet address found!");

    try {
      const response = await axios.post("http://localhost:3999/sellorder", {
        wallet_address: walletAddress,
        cct_amount: amount,
        price_per_cct: price,
      });

      alert(response.data.message);
    } catch (error) {
      console.error("❌ Error placing sell order:", error);
      alert("Failed to place sell order");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Place a Sell Order</h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Amount of CCT"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price per CCT (ETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {!approved ? (
          <button onClick={approveTokens} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Approve Tokens
          </button>
        ) : (
          <button onClick={placeSellOrder} className="bg-green-500 text-white px-4 py-2 rounded">
            Place Sell Order
          </button>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
