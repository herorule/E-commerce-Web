import mongoose from 'mongoose';
import Payment from './payment.mjs';
import Shipper from './shipper.mjs';

const { Schema } = mongoose;

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    address: { type: String, required: true, trim: true },
    note: { type: String, required: true, trim: true },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    status: {
        type: String,
        required: true,
        enum: [
            'Processing',
            'Confirm',
            'Packaging',
            'Delivering',
            'Delivered',
            'Canceled',
        ],
        default: 'Processing',
    },
    shipperId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ShipperPartner',
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
});

const OrderItemSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, required: true, ref: 'Order' },
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
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
    quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
});

export const Order = mongoose.model('Order', OrderSchema);
export const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

OrderSchema.post('remove', async function (doc, next) {
    await OrderItem.deleteMany({ orderId: this._id }).exec();
    if (this.paymentId) {
        await Payment.findByIdAndDelete(this.paymentId).exec();
    }
    if (this.shipperId) {
        await Shipper.findByIdAndDelete(this.shipperId).exec();
    }
    next();
});
