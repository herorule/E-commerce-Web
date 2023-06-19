import express from 'express';
import Product from '../models/product.mjs';
import * as Util from './util.mjs';

const router = express.Router();

router.get('/', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (Object.keys(req.query).length === 0) {
        res.send(await Product.find().exec());
    } else {
        if (req.query.search) {
            res.send(await Product.fuzzySearch(req.query.search));
        } else {
            let filter = Util.toFilter(req.query);
            if (filter.category && filter.category === 'default')
                filter.category = { $in: [null, []] };
            res.send(await Product.find(filter).exec());
        }
    }
});

router.post('/add', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        res.status(403).end();
        return;
    }

    const query = new Product(req.body);

    try {
        await query.save();
        res.send(query);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.get('/:id', async function (req, res) {
    res.setHeader('Connection', 'close');

    try {
        const query = await Product.findById(req.params.id).exec();
        res.send(query);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.delete('/:id/remove', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        res.status(403).end();
        return;
    }

    try {
        await Product.findByIdAndRemove(req.params.id).exec();
        res.end();
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.patch('/:id/edit', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        res.status(403).end();
        return;
    }

    try {
        const query = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).exec();
        res.send(query);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

export default router;
