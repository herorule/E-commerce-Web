import mongoose from 'mongoose';
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    status: { type: String, required: true, trim: true },
    amount: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
    paymentDate: Date,
    method: { type: String, required: true, trim: true },
    transactionNo: { type: String, trim: true },
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
