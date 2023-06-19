import './env.mjs';
import admin from 'firebase-admin';
import * as fs from 'fs';

let serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_ID,
});

export default admin.storage().bucket();
