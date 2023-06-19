import './env.mjs';

const port = process.env.PORT || 5000;
const connectionString = process.env.URI || 'mongodb://127.0.0.1/shop';
const sessionSecret = process.env.SESSION_SECRET || '12345';

// Import application libraries
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';

import accountRoute from './routes/account.mjs';
import productRoute from './routes/product.mjs';
import categoryRoute from './routes/category.mjs';
import orderRoute from './routes/order.mjs';
import imageRoute from './routes/image.mjs';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
    session({
        secret: sessionSecret,
        resave: true,
        saveUninitialized: false,
    })
);
app.use(express.urlencoded({ extended: true }));

// Load routes
app.get('/', (req, res) => {
    res.json({});
});

app.use('/api/account', accountRoute);
app.use('/api/product', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/order', orderRoute);
app.use('/api/image', imageRoute);

(async function () {
    try {
        await mongoose.connect(connectionString);

        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
