import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Marketplace from "./components/marketplace/MarketPlace";
import SideNavbar from "./components/NavBar/index";
import { useEffect, useState } from "react";
import SignIn from "./components/signinpage/InputBox";
import MyBids from "./components/bids/MyBids";
import MyOrders from "./components/orders/MyOrders";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <div className="flex">
                <SideNavbar/> {/* ✅ Sidebar stays constant */}
                <div className="flex-1 p-4">
                  <Routes>
                    <Route path="/dashboard/:company_name" element={<Dashboard />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/orders" element={<MyOrders />} />
                    <Route path="/bids" element={<MyBids />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/signin" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

