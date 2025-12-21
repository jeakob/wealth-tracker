import React from 'react';
import { Wallet, TrendingUp, PiggyBank, Building2, Home, Gem, Coins, HelpCircle } from "lucide-react";

export const getAssetIcon = (type) => {
    // Normalize type for comparison
    const normalizedType = type ? type.toLowerCase() : '';

    if (normalizedType.includes('savings') || normalizedType.includes('cash') || normalizedType === 'bank') {
        return <Wallet className="w-4 h-4 text-emerald-500" />;
    }
    if (normalizedType.includes('investment') || normalizedType.includes('isa') || normalizedType.includes('stock') || normalizedType.includes('share') || normalizedType.includes('bond')) {
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
    }
    if (normalizedType.includes('pension') || normalizedType.includes('retirement') || normalizedType.includes('fund')) {
        // Pension Fund contains 'fund', so moving 'fund' here or keeping it specific.
        // The user has "Pension Fund". 'pension' covers it.
        return <PiggyBank className="w-4 h-4 text-amber-500" />;
    }
    if (normalizedType.includes('business') || normalizedType.includes('equity')) {
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
    if (normalizedType.includes('property') || normalizedType.includes('estate') || normalizedType.includes('house') || normalizedType.includes('flat')) {
        return <Home className="w-4 h-4 text-indigo-500" />;
    }
    if (normalizedType.includes('alternative') || normalizedType.includes('crypto')) {
        return <Gem className="w-4 h-4 text-pink-500" />;
    }
    if (normalizedType.includes('gold') || normalizedType.includes('metal') || normalizedType.includes('precious')) {
        return <Gem className="w-4 h-4 text-yellow-600" />; // Gold color for Gold
    }
    if (normalizedType.includes('miscellaneous') || normalizedType.includes('other') || normalizedType.includes('antique') || normalizedType.includes('jewelry')) {
        return <Coins className="w-4 h-4 text-orange-400" />;
    }

    return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
};
