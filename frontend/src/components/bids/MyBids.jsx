import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBids = () => {
  const [bids, setBids] = useState([]);
  
  useEffect(() => {
    const fetchBids = async () => {
      try {
        // Retrieve wallet_address from localStorage
        const walletAddress = localStorage.getItem("wallet_address");

        if (!walletAddress) {
          console.error("❌ No wallet address found in localStorage");
          return;
        }

        // API call to fetch bids
        const response = await axios.post("http://localhost:3999/bidbywallet", {
          wallet_address: walletAddress,
        });

        console.log(walletAddress)
        console.log(response)

        if (response.data.bids) {
          // Filter only pending bids and sort by latest first
          const pendingBids = response.data.bids
            .filter((bid) => bid.status === "PENDING")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setBids(pendingBids);
        }
      } catch (error) {
        console.error("❌ Error fetching bids:", error);
      }
    };

    fetchBids();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Pending Bids</h1>

      {bids.length === 0 ? (
        <p className="text-gray-500">No pending bids found.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="p-4 border rounded-lg shadow bg-white">
              <p className="text-lg font-semibold">Order Type: {bid.Order?.order_type || "N/A"}</p>
              <p className="text-gray-700">Bid Price: {bid.bid_price} ETH</p>
              <p className="text-gray-700">CCT Amount: {bid.cct_amount} CCT</p>
              <p className="text-sm text-gray-500">Placed on: {new Date(bid.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;
