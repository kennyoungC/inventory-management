import OpenAI from 'openai';

type GenerateSupplierReorderEmailArgs = {
    restaurantName: string;
    productName: string;
    currentStock: number;
    minimumStockLevel: number;
    measurementUnit: string;
    supplierName?: string | null;
    supplierEmail?: string | null;
};

export async function generateSupplierReorderEmail({
    restaurantName,
    productName,
    currentStock,
    minimumStockLevel,
    measurementUnit,
    supplierName,
    supplierEmail,
}: GenerateSupplierReorderEmailArgs): Promise<{
    summary: string;
    summaryHtml: string;
}> {
    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const systemMessage = `You are an assistant that drafts short, professional reorder emails for restaurant inventory.  
Keep it concise, friendly, and actionable. Include a clear subject line.`;

        const userMessage = `Context:
- Restaurant: ${restaurantName}
- Product: ${productName}
- Current stock: ${currentStock} ${measurementUnit}
- Minimum stock level: ${minimumStockLevel} ${measurementUnit}
- Supplier: ${supplierName ?? ''}${supplierEmail ? ` <${supplierEmail}>` : ''}

Task:
Draft a brief reorder email including:
1. A subject line.
2. Greeting using supplier name (if available).
3. Statement of product, current vs minimum stock.
4. Polite request to confirm availability and lead time.
5. Suggested reorder quantity (recommend enough to reach **double** the minimum stock level).
6. Signature with the restaurant name **"${restaurantName}"**.
  Do not use placeholders like [Your Restaurant Name]

Return only **JSON** with keys "subject" and "bodyText". Keep bodyText ~100-150 words.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 300,
            response_format: { type: 'json_object' },
        });

        const assistantContent = response.choices?.[0]?.message?.content ?? '';

        let subject = `Reorder Request: ${productName.charAt(0).toUpperCase() + productName.slice(1)}`;
        let bodyText = assistantContent;

        const parsed = JSON.parse(assistantContent);

        if (parsed.subject && parsed.bodyText) {
            subject = String(parsed.subject);
            bodyText = String(parsed.bodyText);
        }

        const mailto = `mailto:${supplierEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

        const summary = `Reorder Request for ${productName} – Current: ${currentStock} ${measurementUnit}, Min: ${minimumStockLevel} ${measurementUnit}`;

        const summaryHtml = `${summary} <a className="underline text-blue-500" href="${mailto}">Open Draft Email</a>
`;

        return { summary, summaryHtml };
    } catch (error) {
        console.error('Error generating AI reorder email draft:', error);
        const subject = `Reorder Request: ${productName}`;
        const bodyText = `Dear Supplier ${supplierName},\n\nWe need to reorder ${productName}. Current stock is ${currentStock} ${measurementUnit}, below the minimum of ${minimumStockLevel} ${measurementUnit}.\n\nPlease confirm availability and lead time.\n\nThank you,\n${restaurantName}`;

        const mailto = supplierEmail
            ? `mailto:${supplierEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`
            : undefined;

        const summary = `Reorder Request for ${productName} – Current: ${currentStock} ${measurementUnit}, Min: ${minimumStockLevel} ${measurementUnit}`;
        const summaryHtml = mailto
            ? `${summary} (<a href="${mailto}" target="_blank">Open Draft Email</a>)`
            : summary;

        return { summary, summaryHtml };
    }
}
