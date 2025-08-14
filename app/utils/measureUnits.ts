export type SelectOption = {
    value: string;
    label: string;
};

// Define your group type
export type SelectGroupOption = {
    label: string;
    options: SelectOption[];
};

export const measurementUnitsGrouped: SelectGroupOption[] = [
    {
        label: 'General Count Units',
        options: [
            { value: 'bag', label: 'Bag' },
            { value: 'bottle', label: 'Bottle' },
            { value: 'box', label: 'Box' },
            { value: 'can', label: 'Can' },
            { value: 'case', label: 'Case' },
            { value: 'dozen', label: 'Dozen (doz)' },
            { value: 'item', label: 'Item' },
            { value: 'jar', label: 'Jar' },
            { value: 'pack', label: 'Pack' },
            { value: 'pair', label: 'Pair (pr)' },
            { value: 'piece', label: 'Piece (pc)' },
            { value: 'roll', label: 'Roll' },
            { value: 'set', label: 'Set' },
            { value: 'unit', label: 'Unit (u)' },
        ],
    },
    {
        label: 'Weight',
        options: [
            { value: 'gram', label: 'Gram (g)' },
            { value: 'kilogram', label: 'Kilogram (kg)' },
            { value: 'ounce', label: 'Ounce (oz)' },
            { value: 'pound', label: 'Pound (lb)' },
        ],
    },
    {
        label: 'Volume (Liquids/Dry)',
        options: [
            { value: 'barrel', label: 'Barrel (bbl)' },
            { value: 'cup', label: 'Cup' },
            { value: 'fluid-ounce', label: 'Fluid Ounce (fl oz)' },
            { value: 'gallon', label: 'Gallon (gal)' },
            { value: 'liter', label: 'Liter (l)' },
            { value: 'milliliter', label: 'Milliliter (ml)' },
            { value: 'pint', label: 'Pint (pt)' },
            { value: 'quart', label: 'Quart (qt)' },
        ],
    },
    {
        label: 'Kitchen-Specific',
        options: [
            { value: 'clove', label: 'Clove' },
            { value: 'dash', label: 'Dash' },
            { value: 'drop', label: 'Drop' },
            { value: 'fillet', label: 'Fillet' },
            { value: 'pinch', label: 'Pinch' },
            { value: 'slice', label: 'Slice' },
            { value: 'stick', label: 'Stick' },
            { value: 'tablespoon', label: 'Tablespoon (tbsp)' },
            { value: 'teaspoon', label: 'Teaspoon (tsp)' },
        ],
    },
];
