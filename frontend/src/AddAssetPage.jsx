import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import AddAssetForm from './components/dashboard/AddAssetForm';

const AddAssetPage = ({ onAdd, bankAccounts, defaultCurrency }) => {
    const navigate = useNavigate();

    const handleAdd = async (assetData) => {
        await onAdd(assetData);
        navigate('/'); // Redirect to dashboard after adding
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Add New Asset</h1>
            </div>

            <AddAssetForm
                onAdd={handleAdd}
                bankAccounts={bankAccounts}
                defaultCurrency={defaultCurrency}
            // No editing props needed here as it's strictly for adding
            />
        </div>
    );
};

export default AddAssetPage;
