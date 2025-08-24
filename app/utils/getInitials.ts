export function getInitials(input: string): string {
    if (!input) return '';

    const words = input.trim().split(/\s+|&/).filter(Boolean);

    if (words.length === 1) {
        const word = words[0];
        return word.slice(0, 2).toUpperCase();
    }

    if (words.length > 2) {
        const first = words[0].charAt(0).toUpperCase();
        const last = words[words.length - 1].charAt(0).toUpperCase();
        return `${first}${last}`;
    }

    return words.map(word => word.charAt(0).toUpperCase()).join('');
}

export function prettyCategory(slug: string): string {
    const parts = slug
        .trim()
        .toLowerCase()
        .split(/[-_]+/) // split on - or _
        .filter(Boolean);

    const titled = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1));

    // If it’s exactly two words, join with an ampersand.
    if (titled.length === 2) return `${titled[0]} & ${titled[1]}`;

    // Otherwise, just title-case and join with spaces.
    return titled.join(' ');
}
