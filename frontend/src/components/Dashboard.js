import React from 'react';
import NetWorthChart from '../charts/NetWorthChart';
import InvestmentChart from '../charts/InvestmentChart';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <NetWorthChart />
    <InvestmentChart />
  </div>
);

export default Dashboard;
