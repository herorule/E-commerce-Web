import '../env.mjs';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const phoneRegEx = /^\d+$/;
const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Customer', 'Admin'],
        defualt: 'Customer',
    },
    phone: {
        type: String,
        required: true,
        validate: (phone) => {
            return phoneRegEx.test(phone);
        },
        match: phoneRegEx,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (email) => {
            return emailRegEx.test(email);
        },
        match: emailRegEx, // https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
    },
    address: { type: String, required: true, trim: true },
});

const UserModel = mongoose.model('User', UserSchema);

UserModel.findOneAndUpdate(
    { username: 'admin' },
    {
        password: process.env.ADMIN_PASSOWRD || '123456',
        type: 'Admin',
        phone: '0000',
        email: 'admin@admin.com',
        address: 'Shop',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
).exec();

export default UserModel;
