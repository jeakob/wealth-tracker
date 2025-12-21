import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Sun, Moon, Trash2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { useTheme } from "@/components/ThemeProvider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAssets, deleteAsset } from './api/index'; // Import for clear data

function SettingsPage({ defaultCurrency, setDefaultCurrency }) {
  const { theme, setTheme } = useTheme()
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState('');
  const [clearSuccess, setClearSuccess] = useState('');

  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all data?")) return;

    setClearing(true);
    setClearError('');
    setClearSuccess('');

    try {
      // 1. Fetch all assets
      const assets = await getAssets();

      // 2. Delete all assets one by one (since no bulk delete API)
      await Promise.all(assets.map(asset => deleteAsset(asset.id)));

      setClearSuccess("All data has been successfully deleted.");
    } catch (e) {
      console.error(e);
      setClearError("Failed to clear some data. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="theme-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="theme-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Currency */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your global application settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Tracking Currency</Label>
              <p className="text-sm text-muted-foreground">
                Select the currency used by default when adding new assets.
              </p>
            </div>
            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['USD', 'EUR', 'GBP', 'PLN', 'BTC', 'ETH'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Data Management</CardTitle>
          <CardDescription>Manage your stored data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Clearing your data will permanently remove all saved assets. This is intended for a fresh start and cannot be undone.
            </AlertDescription>
          </Alert>

          {clearError && <p className="text-sm text-destructive">{clearError}</p>}
          {clearSuccess && <p className="text-sm text-green-600 dark:text-green-400">{clearSuccess}</p>}

          <Button
            variant="destructive"
            onClick={handleClearData}
            disabled={clearing}
            className="w-full sm:w-auto"
          >
            {clearing ? "Clearing..." : "Clear Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
