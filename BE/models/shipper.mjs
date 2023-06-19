import mongoose from 'mongoose';
const { Schema } = mongoose;

const phoneRegEx = /^\d+$/;
const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/;

const ShipperPartnerSchema = new Schema({
    name: { type: String, required: true, trim: true },
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
        validate: (email) => {
            return emailRegEx.test(email);
        },
        match: emailRegEx, // https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
    },
});

const Shipper = mongoose.model('ShipperPartner', ShipperPartnerSchema);

export default Shipper;
