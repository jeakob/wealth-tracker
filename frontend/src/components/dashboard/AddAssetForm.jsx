import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const assetTypes = [
    { value: 'Property / Real Estate', label: 'Property / Real Estate' },
    { value: 'Pension Fund', label: 'Pension Fund' },
    { value: 'Savings Account', label: 'Savings Account' },
    { value: 'Bonds Portfolio', label: 'Bonds Portfolio' },
    { value: 'Stocks/Shares Portfolio', label: 'Stocks/Shares Portfolio' },
    { value: 'ISA (Individual Savings Account)', label: 'ISA (Individual Savings Account)' },
    { value: 'Cryptocurrency', label: 'Cryptocurrency' },
    { value: 'Private Business Equity', label: 'Private Business Equity' },
    { value: 'Gold/Precious Metals', label: 'Gold/Precious Metals' },
    { value: 'Miscellaneous (Antiques, Jewelry, etc.)', label: 'Miscellaneous (Antiques, Jewelry, etc.)' },
];

const currencies = ['USD', 'EUR', 'GBP', 'PLN', 'BTC', 'ETH'];

const AddAssetForm = ({ onAdd, onSave, editingAsset, onCancelEdit, bankAccounts, defaultCurrency }) => {
    const [form, setForm] = useState({
        type: 'Savings Account',
        name: '',
        value: '',
        currency: defaultCurrency || 'USD',
        date: new Date().toISOString().slice(0, 10),
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (editingAsset) {
            setForm(editingAsset);
        } else {
            setForm(prev => ({ ...prev, currency: defaultCurrency || 'USD' }));
        }
        setError('');
    }, [editingAsset, defaultCurrency]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    const handleSubmit = () => {
        if (!form.name || !form.value) {
            setError('Name and Value are required.');
            return;
        }
        if (editingAsset) {
            onSave(form);
        } else {
            onAdd(form);
            setForm({ type: 'Savings Account', name: '', value: '', currency: defaultCurrency || 'USD', date: new Date().toISOString().slice(0, 10) });
        }
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{editingAsset ? "Edit Asset" : "Add New Asset"}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={form.type} onValueChange={(val) => handleChange('type', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {assetTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{form.type === 'bank' ? 'Bank Account' : 'Name'}</Label>
                        {form.type === 'bank' ? (
                            <Select value={form.name} onValueChange={(val) => handleChange('name', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankAccounts.map(acc => <SelectItem key={acc.id} value={acc.name}>{acc.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Asset Name"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Value</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={form.value}
                                onChange={(e) => handleChange('value', e.target.value)}
                                placeholder="0.00"
                                className="flex-1"
                            />
                            <Select value={form.currency} onValueChange={(val) => handleChange('currency', val)}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="date">Date</Label>
                        <DatePicker
                            value={form.date}
                            onChange={(val) => setForm({ ...form, date: val })}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <div className="flex justify-end gap-2">
                        {editingAsset && (
                            <Button variant="outline" onClick={onCancelEdit}>Cancel</Button>
                        )}
                        <Button onClick={handleSubmit} className="w-full md:w-auto">
                            {editingAsset ? <><Save className="mr-2 h-4 w-4" /> Save Changes</> : <><PlusCircle className="mr-2 h-4 w-4" /> Add Asset</>}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddAssetForm;
