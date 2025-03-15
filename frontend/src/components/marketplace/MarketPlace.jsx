import React, { useEffect, useState } from "react";
import axios from "axios";
import PriceTrendChart2 from "../dashboard/components/PriceTrendChart2";

const MarketPlace = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bidPrice, setBidPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3999/listorder");
        // Filter only pending orders
        const pendingOrders = response.data.orders.filter(order => order.status === "pending");
        setOrders(pendingOrders);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePlaceBid = (order) => {
    setSelectedOrder(order);
    setBidPrice("");
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleSubmitBid = async () => {
    if (!bidPrice) return alert("Please enter a bid price.");

    setIsSubmitting(true);
    const buyer_wallet_address = localStorage.getItem("wallet_address"); // Get from localStorage

    try {
      console.log(buyer_wallet_address);

      const response = await axios.post("http://localhost:3999/placebid", {
        buyer_wallet_address,
        order_id: selectedOrder.id,
        bid_price: parseFloat(bidPrice),
        cct_amount: selectedOrder.cct_amount, // Send the order's CCT amount
      });

      alert(response.data.message || "Bid placed successfully!");
      handleCloseModal();
    } catch (error) {
      alert("Error placing bid. Please try again: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <h2 className="text-center text-lg font-semibold text-gray-600">Loading orders...</h2>;
  if (error) return <h2 className="text-center text-red-500">{error}</h2>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Marketplace</h1>
      <p className="text-lg text-gray-600 text-center mb-8">Explore available carbon credits for trade.</p>

      {/* Price Trend Chart */}
      <div className="mb-10">
        <PriceTrendChart2
          data={[
            { date: "Mon", price: 25 },
            { date: "Tue", price: 28 },
            { date: "Wed", price: 26 },
            { date: "Thu", price: 32 },
            { date: "Fri", price: 30 },
            { date: "Sat", price: 35 },
            { date: "Sun", price: 38 }
          ]}
        />
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No pending orders available at the moment.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-gray-600"><strong>CCT Amount:</strong> {order.cct_amount}</p>
              <p className="text-gray-600"><strong>Price per CCT:</strong> {order.price_per_cct} ETH</p>
              <p className="text-gray-500 text-sm"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <button 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => handlePlaceBid(order)}
              >
                Place Bid
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for placing bid */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Place Bid</h2>
            <p className="text-gray-700 mb-2"><strong>Order from:</strong> {selectedOrder.User.company_name}</p>
            <p className="text-gray-700 mb-2"><strong>CCT Amount:</strong> {selectedOrder.cct_amount}</p>
            
            <label className="block text-sm font-medium text-gray-700">Bid Price per CCT (ETH)</label>
            <input 
              type="number"
              className="w-full border p-2 rounded mt-1 mb-4"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
            />

            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={handleCloseModal}>
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmitBid}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
