import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, TrendingUp, Droplets, Activity, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getAssetIcon } from '@/lib/assetIcons';
import { getLiabilities } from '@/api';
import { pluralizeAssetType } from '@/lib/utils';

const COLORS = [
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#6366f1", // indigo-500
    "#ec4899", // pink-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
    "#14b8a6", // teal-500
    "#4b5563", // gray-600
];

const Dashboard = ({ assets, defaultCurrency = 'USD' }) => {
    const [liabilities, setLiabilities] = useState([]);

    useEffect(() => {
        const fetchLiabilities = async () => {
            try {
                const data = await getLiabilities();
                setLiabilities(data);
            } catch (err) {
                console.error('Failed to fetch liabilities:', err);
            }
        };
        fetchLiabilities();
    }, []);

    // Calculate total liabilities (only those included in net worth)
    const totalLiabilities = liabilities
        .filter(l => l.includeInNetWorth)
        .reduce((sum, l) => sum + Number(l.balance), 0);

    // Define Liquid Categories
    const liquidTypes = [
        'Savings Account',
        'Savings & Cash',
        'Bank Account',
        'Stocks/Shares Portfolio',
        'Cryptocurrency',
        'Bonds Portfolio',
        'ISA (Individual Savings Account)',
        'Gold/Precious Metals'
    ];

    const isLiquid = (type) => {
        if (!type) return false;
        const lower = type.toLowerCase();
        return liquidTypes.some(t => lower.includes(t.toLowerCase())) ||
            lower.includes('bank') ||
            lower.includes('cash') ||
            lower.includes('stock') ||
            lower.includes('crypto') ||
            lower.includes('gold');
    };

    const totalAssets = assets.reduce((sum, a) => sum + Number(a.value), 0);
    const liquidAssets = assets
        .filter(a => isLiquid(a.type))
        .reduce((sum, a) => sum + Number(a.value), 0);

    const netWorth = totalAssets - totalLiabilities;
    const liquidNetWorth = liquidAssets - totalLiabilities;

    // 2. Prepare Chart Data (Category Breakdown)
    const categoryMap = assets.reduce((acc, asset) => {
        const key = asset.type;
        acc[key] = (acc[key] || 0) + Number(asset.value);
        return acc;
    }, {});

    const categoryData = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // 3. Recent Activity (Last 5 assets added/modified - assumes assets sorted by date desc)
    const recentActivity = assets.slice(0, 5);

    const currencySymbol = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'PLN': 'zł', 'BTC': '₿', 'ETH': 'Ξ'
    }[defaultCurrency] || defaultCurrency;

    const formatMoney = (val) => `${currencySymbol}${val.toLocaleString()}`;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your financial health.</p>
                </div>
                <Button asChild>
                    <Link to="/add-asset">Add Asset <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatMoney(netWorth)}</div>
                        <p className="text-xs text-muted-foreground">Assets - Liabilities</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Liquid Net Worth</CardTitle>
                        <Droplets className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatMoney(liquidNetWorth)}</div>
                        <p className="text-xs text-muted-foreground">Liquid Assets - Liabilities</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                        <TrendingUp className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatMoney(totalAssets)}</div>
                        <p className="text-xs text-muted-foreground">{assets.length} items being tracked</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-transparent">
                {/* Asset Breakdown */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Asset Breakdown</CardTitle>
                        <CardDescription>Portfolio composition by category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {categoryData.length === 0 ? (
                                <p className="text-muted-foreground">No data available.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [formatMoney(value), 'Value']}
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        {/* Legend / List */}
                        <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto pr-2">
                            {categoryData.map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="truncate max-w-[150px] capitalize">
                                            {pluralizeAssetType(item.name)}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs">{((item.value / totalAssets) * 100).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest assets added or updated.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No recent activity.</p>
                            ) : (
                                recentActivity.map((asset) => (
                                    <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-background border">
                                                {getAssetIcon(asset.type)}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium leading-none">{asset.name}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(asset.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <div className="font-semibold">{formatMoney(asset.value)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-6 pt-4 border-t text-center">
                            <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary" asChild>
                                <Link to="/graphs">View Full Analysis <ArrowRight className="ml-1 h-3 w-3" /></Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
