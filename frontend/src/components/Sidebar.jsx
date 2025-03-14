const Sidebar = () => {
    return (
      <div className="w-60 h-screen bg-white shadow-md p-5 fixed top-0 left-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-4"></h1>
        <ul className="space-y-4">
          <li className="text-gray-700 hover:text-blue-500 cursor-pointer font-medium">
            Home
          </li>
          <li className="text-gray-700 hover:text-blue-500 cursor-pointer font-medium">
            MarketPlace
          </li>
          <li className="text-gray-700 hover:text-blue-500 cursor-pointer font-medium">
            Transactions
          </li>
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
  