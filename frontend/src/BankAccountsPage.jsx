import React, { useState, useEffect } from 'react';
import { getBankAccounts, addBankAccount, deleteBankAccount } from './api/index';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';

function BankAccountsPage() {
    const [bankAccounts, setBankAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        if (!newAccount.trim()) return;
        setLoading(true);
        setError('');
        try {
            await addBankAccount(newAccount.trim());
            setNewAccount('');
            fetchAccounts();
        } catch (error) {
            setError('Failed to add bank account.');
        } finally {
            setLoading(false);
        }
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

                    <div className="flex gap-2">
                        <Input
                            placeholder="New Bank Account Name"
                            value={newAccount}
                            onChange={e => setNewAccount(e.target.value)}
                            disabled={loading}
                        />
                        <Button onClick={handleAdd} disabled={loading || !newAccount.trim()}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add"}
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        {loading && bankAccounts.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                        ) : bankAccounts.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">No bank accounts added.</div>
                        ) : (
                            <div className="divide-y">
                                {bankAccounts.map(acc => (
                                    <div key={acc.id} className="flex items-center justify-between p-4">
                                        <span className="font-medium">{acc.name}</span>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(acc.id)} disabled={loading}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default BankAccountsPage;
