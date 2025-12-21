import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const LiabilitiesPage = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Liabilities</CardTitle>
                    <CardDescription>Track your debts, loans, and other liabilities.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground border-dashed border-2 rounded-lg m-6">
                    Liabilities tracking feature coming soon.
                </CardContent>
            </Card>
        </div>
    );
};

export default LiabilitiesPage;
