// models/SkuCounter.ts
import { Schema, model, models, Document } from 'mongoose';

interface SkuCounterDto extends Document {
    category: string;
    lastSequence: number;
}

const SkuCounterSchema = new Schema<SkuCounterDto>({
    category: { type: String, required: true, unique: true },
    lastSequence: { type: Number, default: 0 },
});

const SkuCounter = models.SkuCounter || model<SkuCounterDto>('SkuCounter', SkuCounterSchema);
export default SkuCounter;
