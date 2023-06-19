import express from 'express';
import Shipper from '../models/shipper.mjs';
import * as Util from './util.mjs';

const router = express.Router();

router.get('/', async function (req, res) {
    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if (!Util.isAdmin(req)) {
        res.status(403).end();
        return;
    }

    if (Object.keys(req.query).length === 0) {
        res.send(await Shipper.find().exec());
    } else {
        let filter = Util.toFilter(req.query);
        res.send(await Shipper.find(filter).exec());
    }
});

router.post('/add', async function (req, res) {
    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if (!Util.isAdmin(req)) {
        res.status(403).end();
        return;
    }

    try {
        const query = new Shipper({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
        });
        res.send(await query.save());
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.get('/:id', async function (req, res) {
    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Shipper.findById(req.params.id).exec();
        res.send(query);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.post('/:id/edit', async function (req, res) {
    if (!Util.isAdminLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if (!Util.isAdmin(req)) {
        res.status(403).end();
        return;
    }

    try {
        const query = await Shipper.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).exec();
        res.send(query);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.post('/:id/remove', async function (req, res) {
    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if (!Util.isAdmin(req)) {
        res.status(403).end();
        return;
    }

    try {
        const query = await Shipper.findByIdAndRemove(req.params.id).exec();
        res.send(query);
    } catch (e) {
        res.status(500).send(e.message);
    }
});
