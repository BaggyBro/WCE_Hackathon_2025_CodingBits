import { TrendingUp, TrendingDown } from 'lucide-react';
import PropTypes from 'prop-types';

const CarbonCreditOverview = ({ currentPrice, priceChange }) => {
  const isPriceUp = priceChange >= 0;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm text-gray-600 mb-2">Current Market Price</h3>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold text-gray-900">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className={`flex items-center gap-1 text-sm font-medium ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
            {isPriceUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(priceChange)}%
          </span>
        </div>
      </div>
    </div>
  );
};

CarbonCreditOverview.propTypes = {
  currentPrice: PropTypes.number.isRequired,
  priceChange: PropTypes.number.isRequired,
};

export default CarbonCreditOverview;

