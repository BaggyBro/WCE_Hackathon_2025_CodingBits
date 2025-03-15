import { useEffect, useState } from 'react';
import axios from 'axios';
import { Leaf, LayoutDashboard, History, Settings } from 'lucide-react';
import UserAssets from './UserAssets';
import CarbonCreditOverview from './CarbonCreditOverview';
import PriceTrendChart from './PriceTrendChart';
import DemandSupplyChart from './DemandSupplyChart';
import SideNavbar from '../../NavBar';

// Mock data - In a real app, this would come from an API
const mockPriceData = [
  { date: 'Mon', price: 25 },
  { date: 'Tue', price: 50 },
  { date: 'Wed', price: 16 },
  { date: 'Thu', price: 32 },
  { date: 'Fri', price: 35 },
  { date: 'Sat', price: 46 },
  { date: 'Sun', price: 38 }
];


const DashBoard = () => {
  const [ethBalance, setEthBalance] = useState(0);
  const [cctBalance, setCctBalance] = useState(0);
  const walletAddress = localStorage.getItem('wallet_address');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return;

      try {
        const response = await axios.post('http://localhost:3999/balance', { wallet_address: walletAddress });
        setEthBalance(parseFloat(response.data.eth_balance));
        setCctBalance(parseFloat(response.data.cct_balance));
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  useEffect(() => {
    const loadChatbot = () => {
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
      script1.async = true;
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://files.bpcontent.cloud/2025/03/13/06/20250313060649-M0QYQ1W5.js';
        script2.async = true;
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    };

    loadChatbot(); 
  }, []); 

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Credits Dashboard</h1>
          <p className="text-gray-600">Overview of your carbon credit portfolio</p>
        </header>

        {/* User Assets & Overview */}
        <div className="flex flex-wrap gap-6">
          <UserAssets carbonCredits={cctBalance} ethBalance={ethBalance} />
          <CarbonCreditOverview currentPrice={35.80} priceChange={2.5} />
        </div>

        {/* Charts Section */}
        <div className="flex flex-wrap gap-6 mt-8">
          <div className="flex-1 min-w-[300px]">
            <PriceTrendChart data={mockPriceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
