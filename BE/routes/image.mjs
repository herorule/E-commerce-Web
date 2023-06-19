import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import bucket from '../firebase.mjs';
import * as Util from './util.mjs';

const router = express.Router();

const multerUpload = multer({
    storage: multer.memoryStorage(),
});

/**
 * List all images, with their file name and firebase url.
 */
router.get('/', async function (req, res) {
    res.setHeader('Connection', 'close');

    let query;
    try {
        [query] = await bucket.getFiles();
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }

    let files = [];
    for (let file of query) {
        files.push({
            filename: file.name,
            url: file.publicUrl(),
        });
    }

    res.send(files);
});

router.post('/upload', multerUpload.single('file'), async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        return res.status(403).end();
    }

    if (!req.file) {
        return res.status(400).send('Error: No files found');
    }

    const blob = bucket.file(
        uuidv4().toString() + path.extname(req.file.originalname)
    );

    const blobWriter = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
        predefinedAcl: 'publicRead',
        public: true,
    });

    blobWriter.on('error', (err) => {
        res.status(500).send(err);
    });

    blobWriter.on('finish', () => {
        res.status(200).send({
            original_name: req.file.originalname,
            file_name: blob.name,
            storage_url: blob.publicUrl(),
        });
    });

    blobWriter.end(req.file.buffer);
});

/**
 * Get direct image from filename, alternative method of getting image instead of firebase url.
 */
router.get('/:name', async function (req, res) {
    res.setHeader('Connection', 'close');

    const file = bucket.file(req.params.name);

    if (!(await file.exists())) {
        res.status(404).end();
    } else {
        let [metadata] = await file.getMetadata();
        let [content] = await file.download();
        res.setHeader('Content-type', metadata.contentType);
        res.status(200).send(content);
    }
});

/**
 * Get firebase url of image from filename.
 */
router.get('/:name/firebase', async function (req, res) {
    res.setHeader('Connection', 'close');

    const file = bucket.file(req.params.name);

    if (!(await file.exists())) {
        res.status(404).end();
    } else {
        res.status(200).send({ url: file.publicUrl() });
    }
});

/**
 * Delete image, return 204 on success.
 */
router.get('/:name/remove', async function (req, res) {
    res.setHeader('Connection', 'close');

    const file = bucket.file(req.params.name);

    if (!(await file.exists())) {
        res.status(404).end();
    } else {
        const [response] = await file.delete();
        res.status(response.statusCode).send(response.body);
    }
});

export default router;
