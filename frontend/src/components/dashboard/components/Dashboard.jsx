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
  { date: 'Tue', price: 28 },
  { date: 'Wed', price: 26 },
  { date: 'Thu', price: 32 },
  { date: 'Fri', price: 30 },
  { date: 'Sat', price: 35 },
  { date: 'Sun', price: 38 }
];

const mockDemandSupplyData = [
  { date: 'Mon', demand: 150, supply: 120 },
  { date: 'Tue', demand: 180, supply: 130 },
  { date: 'Wed', demand: 170, supply: 140 },
  { date: 'Thu', demand: 200, supply: 150 },
  { date: 'Fri', demand: 190, supply: 160 },
  { date: 'Sat', demand: 220, supply: 170 },
  { date: 'Sun', demand: 240, supply: 180 }
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
