
import { Leaf, Coins } from 'lucide-react';
import PropTypes from 'prop-types';

const UserAssets = ({ carbonCredits, ethBalance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <Leaf className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-1">Carbon Credits</h3>
          <div className="text-2xl font-semibold text-gray-900">{carbonCredits.toLocaleString()} tCO₂</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <Coins className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm text-gray-600 mb-1">ETH Balance</h3>
          <div className="text-2xl font-semibold text-gray-900">{ethBalance.toFixed(4)} ETH</div>
        </div>
      </div>
    </div>
  );
};

UserAssets.propTypes = {
  carbonCredits: PropTypes.number.isRequired,
  ethBalance: PropTypes.number.isRequired,
};


export default UserAssets;