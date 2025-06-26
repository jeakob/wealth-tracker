import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Stocks', value: 8000 },
  { name: 'Bonds', value: 2000 },
  { name: 'Real Estate', value: 5000 },
];

const InvestmentChart = () => (
  <BarChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#82ca9d" />
  </BarChart>
);

export default InvestmentChart;
