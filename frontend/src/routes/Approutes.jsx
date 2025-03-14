import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MarketPlace from "../pages/MarketPlace";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/marketplace" element={<MarketPlace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
