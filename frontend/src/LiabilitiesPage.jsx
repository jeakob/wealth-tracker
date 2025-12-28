import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingDown, Info, AlertTriangle, Trash2, Pencil } from "lucide-react";
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getLiabilities, addLiability, deleteLiability, updateLiability } from './api/index';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LiabilitiesPage = ({ defaultCurrency = 'GBP' }) => {
    const [liabilities, setLiabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        category: '',
        balance: '',
        interestRate: '',
        institution: '',
        monthlyPayment: '',
        remainingMonths: '',
        includeInNetWorth: false,
        notes: ''
    });

    useEffect(() => {
        fetchLiabilities();
    }, []);

    const fetchLiabilities = async () => {
        try {
            const data = await getLiabilities();
            setLiabilities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!form.name || !form.balance || !form.category) {
            setError('Name, Category, and Balance are required.');
            setLoading(false);
            return;
        }

        try {
            await addLiability({
                ...form,
                balance: parseFloat(form.balance),
                interestRate: form.interestRate ? parseFloat(form.interestRate) : null,
                monthlyPayment: form.monthlyPayment ? parseFloat(form.monthlyPayment) : null,
                remainingMonths: form.remainingMonths ? parseInt(form.remainingMonths) : null,
            });
            await fetchLiabilities();
            setForm({
                name: '',
                category: '',
                balance: '',
                interestRate: '',
                institution: '',
                monthlyPayment: '',
                remainingMonths: '',
                includeInNetWorth: false,
                notes: ''
            });
        } catch (err) {
            setError('Failed to add liability.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this liability?")) return;
        try {
            await deleteLiability(id);
            fetchLiabilities();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleInclude = async (liability) => {
        try {
            await updateLiability(liability.id, { includeInNetWorth: !liability.includeInNetWorth });
            fetchLiabilities();
        } catch (err) { console.error(err); }
    };

    const totalDebt = liabilities.reduce((acc, l) => acc + Number(l.balance), 0);
    const netWorthImpact = liabilities.filter(l => l.includeInNetWorth).reduce((acc, l) => acc + Number(l.balance), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
                    <p className="text-muted-foreground">Manage loans, credit cards, and other debts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {defaultCurrency} {totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Total outstanding balance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Worth Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            -{defaultCurrency} {netWorthImpact.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Amount subtracted from Net Worth</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <Card className="lg:col-span-1 shadow-md h-fit">
                    <CardHeader>
                        <CardTitle>Add New Liability</CardTitle>
                        <CardDescription>Enter details of your debt.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                            <div className="space-y-2">
                                <Label>Liability Name *</Label>
                                <Input placeholder="e.g. Credit Card" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                                        <SelectItem value="Loan">Personal Loan</SelectItem>
                                        <SelectItem value="Mortgage">Mortgage</SelectItem>
                                        <SelectItem value="Student Loan">Student Loan</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Current Balance ({defaultCurrency}) *</Label>
                                <Input type="number" step="0.01" placeholder="0.00" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Interest Rate (%)</Label>
                                    <Input type="number" step="0.01" placeholder="4.5" value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Institution</Label>
                                    <Input placeholder="e.g. Chase" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly Payment ({defaultCurrency})</Label>
                                <Input type="number" step="0.01" placeholder="0.00" value={form.monthlyPayment} onChange={e => setForm({ ...form, monthlyPayment: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <Label>Remaining Duration (Months)</Label>
                                <Input type="number" placeholder="e.g. 12" value={form.remainingMonths} onChange={e => setForm({ ...form, remainingMonths: e.target.value })} />
                            </div>

                            <div className="flex items-start space-x-2 pt-2">
                                <Checkbox id="nw-impact" checked={form.includeInNetWorth} onCheckedChange={(checked) => setForm({ ...form, includeInNetWorth: checked })} />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="nw-impact" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Include in Net Worth
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Unchecked means this won't affect your Dashboard total.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea placeholder="Optional details..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Adding..." : "Add Liability"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {liabilities.length === 0 ? (
                        <Card className="border-dashed flex items-center justify-center p-12 text-muted-foreground">
                            No liabilities added yet.
                        </Card>
                    ) : (
                        liabilities.map(liability => (
                            <Card key={liability.id} className={`transition-all hover:shadow-md ${!liability.includeInNetWorth ? 'opacity-75 bg-muted/30' : ''}`}>
                                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {liability.name}
                                            {!liability.includeInNetWorth && (
                                                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">Excluded</span>
                                            )}
                                        </CardTitle>
                                        <CardDescription>{liability.institution} • {liability.category}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-red-600">
                                            {defaultCurrency} {Number(liability.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                        {liability.interestRate && (
                                            <div className="text-xs text-muted-foreground">
                                                {liability.interestRate}% APR
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-3 text-sm grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-muted-foreground">Monthly: </span>
                                        {liability.monthlyPayment ? `${defaultCurrency} ${Number(liability.monthlyPayment).toFixed(2)}` : '-'}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Remaining: </span>
                                        {liability.remainingMonths ? `${liability.remainingMonths} months` : '-'}
                                    </div>
                                    {liability.notes && (
                                        <div className="col-span-2 text-muted-foreground text-xs bg-muted p-2 rounded mt-2">
                                            {liability.notes}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => toggleInclude(liability)}>
                                        {liability.includeInNetWorth ? "Exclude from NW" : "Include in NW"}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(liability.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiabilitiesPage;
