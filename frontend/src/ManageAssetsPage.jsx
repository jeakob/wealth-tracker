import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import AssetTable from './components/dashboard/AssetTable';

const ManageAssetsPage = ({ assets, onUpdate, onDelete }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Assets</h1>
                        <p className="text-muted-foreground">View, edit, and update your portfolio.</p>
                    </div>
                </div>
                <Button asChild>
                    <Link to="/add-asset">Add New Asset</Link>
                </Button>
            </div>

            <AssetTable
                assets={assets}
                onEdit={onUpdate} // We will change AssetTable to treat onEdit as "Start Editing" or handle update directly
                onDelete={onDelete}
                isManagePage={true}
            />
        </div>
    );
};

export default ManageAssetsPage;
