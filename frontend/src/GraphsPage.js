import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush, LineChart, Line, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const assetTypes = [
  { value: 'Crypto', label: 'Cryptocurrency', color: '#63b3ed' },
  { value: 'Bank', label: 'Bank Account', color: '#f687b3' },
  { value: 'Other', label: 'Other', color: '#ffd54f' },
];

const currencies = [
  { value: 'USD', label: 'USD', color: '#82ca9d' },
  { value: 'EUR', label: 'EUR', color: '#ffc658' },
  { value: 'GBP', label: 'GBP', color: '#ff7f50' },
  { value: 'PLN', label: 'PLN', color: '#8a2be2' },
  { value: 'BTC', label: 'BTC', color: '#f7931a' },
  { value: 'ETH', label: 'ETH', color: '#627eea' },
];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a202c', // Slightly darker background
      paper: '#2d3748', // Slightly darker paper background
    },
    primary: {
      main: '#63b3ed', // A shade of blue
    },
    secondary: {
      main: '#f687b3', // A shade of pink
    },
    text: {
      primary: '#e2e8f0', // Light grey text
      secondary: '#a0aec0', // Muted grey text
    },
  },
});

function GraphsPage({ assets }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stackBy, setStackBy] = useState('assetType'); // State for stacking option

  // Filter assets by date range
  const filteredAssets = assets.filter(asset => {
    const assetDate = new Date(asset.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && assetDate < start) return false;
    if (end && assetDate > end) return false;
    return true;
  });

  // Combine filtered assets based on stacking option
  const combinedData = filteredAssets.reduce((acc, asset) => {
    const key = stackBy === 'assetType' ? asset.type : asset.currency;
    const dateKey = asset.date;

    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey };
    }

    if (!acc[dateKey][key]) {
      acc[dateKey][key] = 0;
    }

    acc[dateKey][key] += Number(asset.value);
    return acc;
  }, {});

  const overviewChartData = Object.values(combinedData).sort((a, b) => a.date.localeCompare(b.date));

  // Prepare data for asset type over time chart (use type.value as key)
  const dates = Array.from(new Set(filteredAssets.map(a => a.date))).sort();
  const typeChartData = dates.map(date => {
    const entry = { date };
    assetTypes.forEach(type => {
      // Accept both string and number for asset.type, and normalize
      entry[type.value] = filteredAssets
        .filter(a => a.date === date && String(a.type).toLowerCase() === String(type.value).toLowerCase())
        .reduce((sum, a) => sum + Number(a.value), 0);
    });
    return entry;
  });

  const handleStackByChange = (event) => {
    setStackBy(event.target.value);
  };

  // Get unique keys for stacking (asset types or currencies)
  const uniqueStackKeys = Array.from(new Set(filteredAssets.map(asset => stackBy === 'assetType' ? asset.type : asset.currency)));

  return (
    <ThemeProvider theme={darkTheme}>
      <Box position="fixed" top={0} left={0} width="100vw" height="100vh" minHeight="100vh" minWidth="100vw" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #232a36 0%, #181c24 100%)', m: 0, p: 0, zIndex: 0 }}>
        <Container maxWidth="xl" disableGutters sx={{ px: 0, m: 0 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 8, mb: 4, background: '#232a36', border: 'none', boxShadow: 'none', outline: 'none' }}>
            <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="text.primary">
              Wealth Graphs
            </Typography>
            <Box display="flex" gap={2} mb={4} justifyContent="center">
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { color: darkTheme.palette.text.primary } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: darkTheme.palette.text.secondary }, '& .MuiInputLabel-root': { color: darkTheme.palette.text.secondary } }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ style: { color: darkTheme.palette.text.primary } }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: darkTheme.palette.text.secondary }, '& .MuiInputLabel-root': { color: darkTheme.palette.text.secondary } }}
              />
              {/* Stacking Option Control */}
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Stack By</InputLabel>
                <Select value={stackBy} label="Stack By" onChange={handleStackByChange}>
                  <MenuItem value="assetType">Asset Type</MenuItem>
                  <MenuItem value="currency">Currency</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Overview Chart */}
            <Typography variant="h6" align="center" gutterBottom fontWeight={700} color="text.primary">
              Asset Value Overview (by Date)
            </Typography>
            {overviewChartData.length === 0 ? (
              <Typography align="center" color="text.secondary">No data to display for the selected date range.</Typography>
            ) : (
              <Box sx={{ width: '100%', minWidth: 600 }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={overviewChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkTheme.palette.text.secondary} /> {/* Styled grid */}
                    <XAxis dataKey="date" stroke={darkTheme.palette.text.primary} label={{ value: 'Date', position: 'insideBottom', fill: darkTheme.palette.text.primary, offset: -10 }} /> {/* Styled axis */}
                    <YAxis stroke={darkTheme.palette.text.primary} /> {/* Styled axis */}
                    {/* Styled tooltip for dark mode */}
                    <Tooltip
                      contentStyle={{ background: darkTheme.palette.background.paper, border: '1px solid ' + darkTheme.palette.text.secondary, color: darkTheme.palette.text.primary }}
                      labelStyle={{ color: darkTheme.palette.text.primary }}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="top" />
                    {/* Render bars based on unique stack keys */}
                    {uniqueStackKeys.map(key => (
                      <Bar key={key} dataKey={key} stackId="a" fill={stackBy === 'assetType' ? (assetTypes.find(type => type.value === key)?.color || '#8884d8') : (currencies.find(cur => cur.value === key)?.color || '#82ca9d')} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Asset Type Over Time Chart */}
            <Typography variant="h6" align="center" gutterBottom fontWeight={700} sx={{ mt: 4 }} color="text.primary">
              Asset Types Over Time
            </Typography>
            {typeChartData.length === 0 ? (
              <Typography align="center" color="text.secondary">No data to display for the selected date range.</Typography>
            ) : (
              <Box sx={{ width: '100%', minWidth: 600 }}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={typeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkTheme.palette.text.secondary} />
                    <XAxis dataKey="date" stroke={darkTheme.palette.text.primary} label={{ value: 'Date', position: 'insideBottom', fill: darkTheme.palette.text.primary, offset: -10 }} />
                    <YAxis stroke={darkTheme.palette.text.primary} />
                    <Tooltip
                       contentStyle={{ background: darkTheme.palette.background.paper, border: '1px solid ' + darkTheme.palette.text.secondary, color: darkTheme.palette.text.primary }}
                       labelStyle={{ color: darkTheme.palette.text.primary }}
                    />
                    <Legend layout="vertical" align="right" verticalAlign="top" formatter={(value) => assetTypes.find(t => t.value === value)?.label || value} />
                    {assetTypes.map(type => (
                      <Line
                        key={type.value}
                        type="monotone"
                        dataKey={type.value}
                        stroke={type.color}
                        strokeWidth={2}
                        dot={false}
                        name={type.label}
                      />
                    ))}
                    <Brush dataKey="date" height={30} stroke={darkTheme.palette.primary.main} travellerWidth={10} fill={darkTheme.palette.background.default} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt={4}>
              <Button variant="contained" color="primary" component={Link} to="/" sx={{ px: 4, fontWeight: 600 }}>
                Back to Data Entry
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default GraphsPage;
