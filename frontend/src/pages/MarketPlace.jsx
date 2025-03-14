import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import Sidebar

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
        const allOrders = response.data.orders;

        // Filter only pending orders and sort by timestamp (newest first)
        const pendingOrders = allOrders
          .filter((order) => order.status === "PENDING")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(pendingOrders);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle bid submission
  const placeBid = async () => {
    if (!bidPrice || isNaN(bidPrice)) {
      alert("Please enter a valid bid price.");
      return;
    }

    setIsSubmitting(true);

    const bidData = {
      buyer_wallet_address: "0x6934D992A4717519825574a0fa99620Ad118406c",
      order_id: selectedOrder.id,
      bid_price: bidPrice,
      cct_amount: selectedOrder.cct_amount,
    };

    try {
      await axios.post("http://localhost:3999/placebid", bidData);
      alert("Bid placed successfully!");
      setSelectedOrder(null); // Close the modal after success
    } catch (error) {
      alert("Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (Fixed Width) */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Orders Section (Takes Remaining Space) */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <div className="w-full h-full">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No pending orders available.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white shadow-md rounded-lg p-5 border border-gray-200 flex justify-between items-center w-full"
                >
                  <div className="flex-grow">
                    <p className="text-lg font-semibold text-gray-800">
                      <span className="text-blue-600">Company:</span> {order.User.company_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">CCT Amount:</span> {order.cct_amount}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Price per CCT:</span> ${order.price_per_cct}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-orange-500 font-semibold mt-2">Status: {order.status}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setBidPrice(order.price_per_cct); // Default bid price
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Place Bid
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bid Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>
            <p className="mb-2">
              <span className="font-semibold">Company:</span> {selectedOrder.User.company_name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">CCT Amount:</span> {selectedOrder.cct_amount}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Current Price per CCT:</span> ${selectedOrder.price_per_cct}
            </p>

            <label className="block text-gray-700 font-semibold mb-1">New Bid Price:</label>
            <input
              type="number"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={placeBid}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Bid..." : "Submit Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
