import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { date: '2024-01', netWorth: 10000 },
  { date: '2024-02', netWorth: 12000 },
  { date: '2024-03', netWorth: 15000 },
];

const NetWorthChart = () => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="netWorth" stroke="#8884d8" />
  </LineChart>
);

export default NetWorthChart;
