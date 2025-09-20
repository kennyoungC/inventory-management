import OpenAI from 'openai';

type GenerateReorderEmailArgs = {
    restaurantName: string;
    productName: string;
    currentStock: number;
    minimumStockLevel: number;
    measurementUnit: string;
    supplierName?: string | null;
    supplierEmail?: string | null;
    supplierMinimumOrderQuantity?: number | string | null;
};

export async function generateAiReorderEmailDraft({
    restaurantName,
    productName,
    currentStock,
    minimumStockLevel,
    measurementUnit,
    supplierName,
    supplierEmail,
    supplierMinimumOrderQuantity,
}: GenerateReorderEmailArgs): Promise<{
    subject: string;
    bodyHtml: string;
    bodyText: string;
    mailto: string | undefined;
}> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const supplierLine = supplierName ? `${supplierName}` : 'Supplier';
    const moq = supplierMinimumOrderQuantity ? String(supplierMinimumOrderQuantity) : 'N/A';

    const system = `You write short, professional reorder emails for restaurant inventory. Keep it concise, friendly, and actionable. Include a clear subject.`;
    const user = `Context:
Restaurant: ${restaurantName}
Product: ${productName}
Current stock: ${currentStock} ${measurementUnit}
Minimum stock level: ${minimumStockLevel} ${measurementUnit}
Supplier: ${supplierLine}${supplierEmail ? ` <${supplierEmail}>` : ''}
Supplier MOQ: ${moq}

Task: Draft a brief reorder email that includes:
- A clear subject line
- Greeting using supplier name if available
- Product name, current stock vs minimum level
- A polite request to confirm availability and lead time
- A suggested reorder quantity (at least to bring stock to 2× minimum level)
- Signature with restaurant name

Return as JSON with keys: subject, bodyText. Keep body to 150-220 words.`;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ],
        temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || '';
    let subject = `Reorder Request: ${productName.charAt(0).toUpperCase() + productName.slice(1)}`;
    let bodyText = content;
    try {
        const parsed = JSON.parse(content);
        if (parsed.subject && parsed.bodyText) {
            subject = String(parsed.subject);
            bodyText = String(parsed.bodyText);
        }
    } catch {
        // If not JSON, keep content as text
    }

    const bodyHtml = bodyText
        .split('\n')
        .map(p => `<p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
        .join('');

    const mailto = supplierEmail
        ? `mailto:${supplierEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`
        : undefined;

    return { subject, bodyHtml, bodyText, mailto };
}
