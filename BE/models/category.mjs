import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true, trim: true },
});

const CategoryTreeSchema = new Schema({
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
    childId: { type: Schema.Types.ObjectId, ref: 'Category' },
});
CategoryTreeSchema.index(
    { parentId: 1, childId: 1 },
    { unique: true, dropDups: true }
);

export const Category = mongoose.model('Category', CategorySchema);
export const CategoryTree = mongoose.model('CategoryTree', CategoryTreeSchema);
