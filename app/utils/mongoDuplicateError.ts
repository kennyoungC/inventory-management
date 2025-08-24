import { MongoDuplicateError } from '@/types/index';

export const MapMongoDuplicateError = (
    mongoError: MongoDuplicateError,
    fieldNameMap: Record<string, string>,
) => {
    if (mongoError.code !== 11000 || !mongoError.keyValue) return null;

    // Keys of offending fields
    const offendingFields = Object.keys(mongoError.keyValue);

    const systemFields = ['restaurant_id', '_id', 'created_by', 'updated_at', 'created_at'];

    // Keep only user-facing fields
    const userFacingFields = offendingFields.filter(f => !systemFields.includes(f));

    // Compound index case (multiple fields failed)
    if (userFacingFields.length > 1) {
        const errors: Record<string, string[]> = {};
        for (const field of userFacingFields) {
            const uiField = fieldNameMap[field] || field;
            errors[uiField] = [`"${mongoError.keyValue[field]}" already exists.`];
        }
        return { errors, message: 'Duplicate value error' };
    }

    const duplicateFieldRaw = userFacingFields[0] || offendingFields[0];
    const duplicateField = fieldNameMap[duplicateFieldRaw] || duplicateFieldRaw;
    const duplicateValue = mongoError.keyValue[duplicateFieldRaw];

    return {
        errors: {
            [duplicateField]: [`"${duplicateValue}" already exists.`],
        },
        message: 'Duplicate value error',
    };
};
