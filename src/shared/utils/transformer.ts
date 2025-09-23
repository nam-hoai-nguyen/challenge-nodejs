// utils/transformer.ts
export const transformer = <T>(obj: T, fields: (keyof T)[]) => {
    const data: Partial<T> = {};
    fields.forEach((field) => {
        data[field] = obj[field];
    });
    return data;
};
