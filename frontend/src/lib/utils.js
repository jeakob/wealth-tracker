import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

// Helper function to pluralize asset type names for display
export const pluralizeAssetType = (type) => {
    if (!type) return type;

    const lowerType = type.toLowerCase();

    // Special cases
    const specialCases = {
        'bank account': 'Bank Accounts',
        'cryptocurrency': 'Cryptocurrencies',
        'property': 'Properties',
        'cash': 'Cash', // Already plural/uncountable
        'savings': 'Savings', // Already plural
        'equity': 'Equities',
        'currency': 'Currencies',
    };

    // Check special cases first
    for (const [singular, plural] of Object.entries(specialCases)) {
        if (lowerType.includes(singular)) {
            return plural;
        }
    }

    // Words ending in 'y' -> 'ies' (except if preceded by vowel)
    if (type.endsWith('y') && !/[aeiou]y$/i.test(type)) {
        return type.slice(0, -1) + 'ies';
    }

    // Words ending in 's', 'ss', 'sh', 'ch', 'x', 'z' -> add 'es'
    if (/(?:s|ss|sh|ch|x|z)$/i.test(type)) {
        return type + 'es';
    }

    // Default: just add 's'
    return type + 's';
};
