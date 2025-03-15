import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiHome, FiUser, FiSettings, FiLogOut, FiShoppingCart, FiBook, FiFlag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { path } from "framer-motion/client";

const menuItems = [
  { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { name: "Marketplace", icon: <FiShoppingCart />, path: "/marketplace" },
  { name: "Transaction", icon: <FiSettings/>, path: "/transaction"},
  { name: "My Orders", icon: <FiBook/>, path: "/orders"},
  { name: "Bids", icon: <FiFlag/>, path: "/bids"}
];

const SideNavbar = ({ activePage }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate(); // ✅ Allows page navigation

  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 60 }}
      className="h-screen bg-blue-600 text-white flex flex-col shadow-lg relative"
    >
      {/* Toggle Button */}
      <button
        className="absolute top-4 right-[-14px] bg-white text-blue-600 rounded-full p-1 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Logo */}
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0 }}
        className="p-4 text-xl font-bold text-center"
      >
        {isOpen && "CarbonTrade"}
      </motion.div>

      {/* Menu */}
      <nav className="mt-8 flex flex-col gap-2">
        {menuItems.map((item) => (
          <motion.div
            key={item.name}
            onClick={() => navigate(item.path)} // ✅ Navigate when clicked
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all ${
              activePage === item.name ? "bg-white text-blue-600" : "hover:bg-blue-500"
            }`}
          >
            {item.icon}
            <motion.span animate={{ opacity: isOpen ? 1 : 0 }}>{isOpen && item.name}</motion.span>
          </motion.div>
        ))}
      </nav>

      {/* Logout */}
      <motion.div
        className="mt-auto p-4 cursor-pointer flex items-center gap-3 hover:bg-blue-500 transition-all"
      >
        <FiLogOut />
        <motion.span animate={{ opacity: isOpen ? 1 : 0 }}>{isOpen && "Logout"}</motion.span>
      </motion.div>
    </motion.div>
  );
};

SideNavbar.propTypes = {
  activePage: PropTypes.string.isRequired, // ✅ Corrected prop validation
};

export default SideNavbar;
