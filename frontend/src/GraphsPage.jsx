import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { getAssetIcon } from "@/lib/assetIcons";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getNetWorthSnapshots, recalculateNetWorth } from "@/api";
import { pluralizeAssetType } from "@/lib/utils";

// Firetracker / Financial Palette (High Contrast)
const COLORS = [
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#dc2626", // red-600
  "#d97706", // amber-600
  "#9333ea", // purple-600
  "#0891b2", // cyan-600
  "#db2777", // pink-600
  "#4b5563", // gray-600
];

const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'PLN': 'zł',
  'BTC': '₿',
  'ETH': 'Ξ'
};

// Custom Tooltip Component for Pie Chart
const CustomPieTooltip = ({ active, payload, symbol }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius)',
        padding: '8px 12px',
        color: 'hsl(var(--foreground))'
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>
          {pluralizeAssetType(data.name)}: {symbol}{data.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

function GraphsPage({ assets, defaultCurrency = 'USD' }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stackBy, setStackBy] = useState('assetType'); // 'assetType' or 'currency'
  const [snapshots, setSnapshots] = useState([]);

  const symbol = CURRENCY_SYMBOLS[defaultCurrency] || defaultCurrency;

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        let data = await getNetWorthSnapshots();
        if ((!data || data.length === 0) && assets.length > 0) {
          // If no snapshots but we have assets, trigger initial calculation
          await recalculateNetWorth();
          data = await getNetWorthSnapshots();
        }
        setSnapshots(data || []);
      } catch (err) {
        console.error("Failed to fetch snapshots", err);
      }
    };
    fetchSnapshots();
  }, [assets]); // Re-fetch if assets prop changes (e.g. parent updates)

  // --- Filtering Logic for ASSETS (Evolution Graph) ---
  const filteredAssets = assets.filter(asset => {
    const assetDate = new Date(asset.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && assetDate < start) return false;
    if (end && assetDate > end) return false;
    return true;
  });

  // --- Snapshot Data for Trend ---
  const trendData = snapshots.map(s => ({
    date: s.snapshot_date,
    total: Number(s.total)
  })).filter(s => {
    // Apply time range filter to snapshots too
    const sDate = new Date(s.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && sDate < start) return false;
    if (end && sDate > end) return false;
    return true;
  });

  // Ensure "Today" is represented if valid
  // (Optional: Carry-over logic if latest snapshot isn't today? 
  // With syncSnapshots running on every update, this shouldn't be strictly necessary 
  // unless the user opens the page next day without updates. 
  // For simplicity, we trust backend standard snapshots for now.)

  // --- Stacked Bar Chart Data Preparation (Evolution) ---
  const combinedData = filteredAssets.reduce((acc, asset) => {
    const key = stackBy === 'assetType' ? asset.type : asset.currency;
    const dateKey = asset.date;
    if (!acc[dateKey]) acc[dateKey] = { date: dateKey };
    if (!acc[dateKey][key]) acc[dateKey][key] = 0;
    acc[dateKey][key] += Number(asset.value);
    return acc;
  }, {});

  const barChartData = Object.values(combinedData).sort((a, b) => a.date.localeCompare(b.date));
  const uniqueStackKeys = Array.from(new Set(filteredAssets.map(asset => stackBy === 'assetType' ? asset.type : asset.currency)));

  // --- Donut Chart Data Preparation (Current Allocation) ---
  // "Current Allocation" should represent the Accumulated Net Worth breakdown at the end of the period.
  // We ignore startDate for this calculation because Net Worth is a balance sheet item (cumulative),
  // not a cash flow item (period-specific).

  const allocationReferenceDate = endDate ? new Date(endDate) : new Date();

  // Filter assets that are on or before the reference date
  const allocationAssets = assets.filter(asset => {
    return new Date(asset.date) <= allocationReferenceDate;
  });

  const allocationDataMap = allocationAssets.reduce((acc, asset) => {
    const key = stackBy === 'assetType' ? asset.type : asset.currency;
    if (!acc[key]) acc[key] = 0;
    acc[key] += Number(asset.value);
    return acc;
  }, {});

  const allocationData = Object.entries(allocationDataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Biggest slices first

  const totalNetWorth = allocationData.reduce((sum, item) => sum + item.value, 0);


  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Analysis</h1>
          <p className="text-muted-foreground">Detailed breakdown of your financial health.</p>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Date Range Inputs */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Time Range</Label>
              <div className="flex items-center gap-2">
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  className="w-[160px]"
                  placeholder="Start Date"
                />
                <span className="text-muted-foreground">-</span>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  className="w-[160px]"
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Group By Select */}
            <div className="space-y-2 min-w-[180px]">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Group By</Label>
              <Select value={stackBy} onValueChange={setStackBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assetType">Asset Type</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Trend Chart: Total Net Worth Over Time */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Net Worth Trend</CardTitle>
            <CardDescription>Total aggregated value over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {trendData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="hsl(var(--muted-foreground))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(str) => format(new Date(str), 'MMM d')}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${symbol}${val.toLocaleString()}`}
                    />
                    <Tooltip
                      cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        borderRadius: 'var(--radius)'
                      }}
                      labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                      formatter={(value) => [`${symbol}${value.toLocaleString()}`, 'Total Net Worth']}
                    />
                    <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Net Worth Evolution (Stacked Bar) */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Net Worth Evolution</CardTitle>
            <CardDescription>Historical value stacked by {stackBy === 'assetType' ? 'Type' : 'Currency'}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              {barChartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="hsl(var(--muted-foreground))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(str) => format(new Date(str), 'MMM d')}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${symbol}${val.toLocaleString()}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        borderRadius: 'var(--radius)'
                      }}
                      labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                      formatter={(value, name) => [`${symbol}${value.toLocaleString()}`, <span className="capitalize">{pluralizeAssetType(name)}</span>]}
                    />
                    <Legend formatter={(value) => <span className="capitalize">{pluralizeAssetType(value)}</span>} />
                    {uniqueStackKeys.map((key, index) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="a"
                        fill={COLORS[index % COLORS.length]}
                        radius={[0, 0, 0, 0]}
                        maxBarSize={50}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side Chart: Current Allocation (Donut) */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Current Allocation</CardTitle>
            <CardDescription>Distribution on {format(allocationReferenceDate, 'MMM d, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full relative">
              {allocationData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">No data.</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip symbol={symbol} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Total Net Worth Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Total</span>
                    <span className="text-xl font-bold">{symbol}{totalNetWorth.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Allocation List */}
            <div className="mt-4 space-y-2">
              {allocationData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="flex-shrink-0">{getAssetIcon(item.name)}</span>
                    <span className="font-medium truncate capitalize" title={item.name}>{pluralizeAssetType(item.name)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{((item.value / totalNetWorth) * 100).toFixed(1)}%</span>
                    <span className="font-mono">{symbol}{item.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GraphsPage;
