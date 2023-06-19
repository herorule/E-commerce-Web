import mongoose from 'mongoose';
import mongooseFuzzySearching from '@rowboat/mongoose-fuzzy-searching';

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true, trim: true },
    price: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    description: { type: String, trim: true },
    images: { type: [String] },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
});

ProductSchema.plugin(mongooseFuzzySearching, { fields: ['name'] });

export default mongoose.model('Product', ProductSchema);
