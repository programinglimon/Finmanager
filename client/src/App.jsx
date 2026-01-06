import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AccountPage from './pages/AccountPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import RechargePage from './pages/RechargePage';
import DuePage from './pages/DuePage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import ProfitPage from './pages/ProfitPage';
import ReportPage from './pages/ReportPage';
import CashPage from './pages/CashPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountPage />} />
          <Route path="/accounts/:type" element={<AccountDetailsPage />} />
          <Route path="/recharge" element={<RechargePage />} />
          <Route path="/due" element={<DuePage />} />
          <Route path="/due/:id" element={<CustomerDetailsPage />} />
          <Route path="/profit" element={<ProfitPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/cash" element={<CashPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
