import React, { useState, useEffect } from 'react';
import { getBankAccounts, addBankAccount, deleteBankAccount, updateBankAccount } from './api/index';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Trash2, ArrowLeft, AlertCircle, TrendingUp, TrendingDown, Save, Pencil, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

function BankAccountsPage({ defaultCurrency }) {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({ name: '', initialBalance: '', initialDate: '', currency: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', initialBalance: '', currentBalance: '', currency: '', initialDate: '' });

    // Update currency when defaultCurrency changes
    useEffect(() => {
        setNewAccount(prev => ({
            ...prev,
            currency: defaultCurrency || 'USD'
        }));
    }, [defaultCurrency]);

    const fetchAccounts = async () => {
        setLoading(true);
        setError('');
        try {
            const accounts = await getBankAccounts();
            setBankAccounts(accounts);
        } catch (error) {
            setError('Failed to fetch bank accounts.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newAccount.name.trim() || !newAccount.initialBalance) return;
        setLoading(true);
        setError('');
        try {
            await addBankAccount({
                name: newAccount.name.trim(),
                initialBalance: parseFloat(newAccount.initialBalance),
                initialDate: newAccount.initialDate || undefined,
                currency: newAccount.currency
            });
            setNewAccount({ name: '', initialBalance: '', initialDate: '', currency: defaultCurrency || 'USD' });
            fetchAccounts();
        } catch (error) {
            setError('Failed to add bank account.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAccount = async (id) => {
        setLoading(true);
        try {
            await updateBankAccount(id, {
                name: editForm.name,
                initialBalance: parseFloat(editForm.initialBalance),
                currentBalance: parseFloat(editForm.currentBalance),
                currency: editForm.currency,
                initialDate: editForm.initialDate || undefined
            });
            setEditingId(null);
            fetchAccounts();
        } catch (error) {
            setError('Failed to update account.');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (acc) => {
        setEditingId(acc.id);
        setEditForm({
            name: acc.name,
            initialBalance: acc.initialBalance,
            currentBalance: acc.currentBalance,
            currency: acc.currency,
            initialDate: acc.initialDate ? new Date(acc.initialDate).toISOString().split('T')[0] : ''
        });
    };

    const handleDelete = async (id) => {
        setLoading(true);
        setError('');
        try {
            await deleteBankAccount(id);
            fetchAccounts();
        } catch (error) {
            setError('Failed to delete bank account.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Bank Accounts</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Accounts</CardTitle>
                    <CardDescription>Add or remove bank accounts to link with your assets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="space-y-2 flex-grow">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input
                                id="account-name"
                                placeholder="e.g., Chase Checking"
                                value={newAccount.name}
                                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 w-full md:w-48">
                            <Label htmlFor="initial-balance">Initial Balance</Label>
                            <Input
                                id="initial-balance"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={newAccount.initialBalance}
                                onChange={(e) => setNewAccount({ ...newAccount, initialBalance: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 w-full md:w-40">
                            <Label htmlFor="initial-date">Initial Date</Label>
                            <DatePicker
                                id="initial-date"
                                value={newAccount.initialDate}
                                onChange={(date) => setNewAccount({ ...newAccount, initialDate: date })}
                                placeholder="Select date"
                            />
                        </div>

                        <div className="space-y-2 w-full md:w-32">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={newAccount.currency}
                                onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}
                            >
                                <SelectTrigger id="currency">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="PLN">PLN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleAdd} disabled={loading || !newAccount.name.trim() || !newAccount.initialBalance}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Account"}
                        </Button>
                    </div>

                    <div className="rounded-md border mt-4">
                        {loading && bankAccounts.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                        ) : bankAccounts.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">No bank accounts added.</div>
                        ) : (
                            <div className="divide-y">
                                {bankAccounts.map(acc => {
                                    const initial = Number(acc.initialBalance);
                                    const current = Number(acc.currentBalance);
                                    const diff = current - initial;
                                    const percent = initial !== 0 ? (diff / initial) * 100 : 0;
                                    const isPositive = diff >= 0;

                                    return (
                                        <div key={acc.id} className="flex items-center justify-between p-4 flex-wrap gap-4">
                                            {editingId === acc.id ? (
                                                <div className="flex-1 w-full gap-2 grid grid-cols-1 md:grid-cols-5 items-end">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium">Name</label>
                                                        <Input
                                                            value={editForm.name}
                                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium">Initial</label>
                                                        <Input
                                                            type="number"
                                                            value={editForm.initialBalance}
                                                            onChange={e => setEditForm({ ...editForm, initialBalance: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium">Initial Date</label>
                                                        <DatePicker
                                                            value={editForm.initialDate}
                                                            onChange={(date) => setEditForm({ ...editForm, initialDate: date })}
                                                            placeholder="Select date"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium">Current</label>
                                                        <Input
                                                            type="number"
                                                            value={editForm.currentBalance}
                                                            onChange={e => setEditForm({ ...editForm, currentBalance: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 pb-0.5">
                                                        <Button size="sm" onClick={() => handleUpdateAccount(acc.id)}>
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-1 min-w-[200px]">
                                                        <div className="font-medium text-lg flex items-center gap-2">
                                                            {acc.name}
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-muted" onClick={() => startEditing(acc)} title="Edit Account">
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Initial: {acc.currency} {initial.toFixed(2)}
                                                            {acc.initialDate && (
                                                                <span className="ml-2 text-xs">({format(new Date(acc.initialDate), 'dd/MM/yy')})</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold">
                                                                {acc.currency} {current.toFixed(2)}
                                                            </div>
                                                            <div className={`text-xs flex items-center justify-end font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                                                {Math.abs(percent).toFixed(1)}% ({diff >= 0 ? '+' : ''}{diff.toFixed(2)})
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => startEditing(acc)} title="Edit">
                                                                <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(acc.id)} disabled={loading} title="Delete">
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}

export default BankAccountsPage;
