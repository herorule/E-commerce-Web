import express from 'express';
import { Category, CategoryTree } from '../models/category.mjs';
import * as Util from './util.mjs';

const router = express.Router();

router.get('/', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (Object.keys(req.query).length === 0) {
        res.send(await Category.find().exec());
    } else {
        let filter = Util.toFilter(req.query);
        res.send(await Category.find(filter).exec());
    }
});

router.post('/add', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        res.status(403).end();
        return;
    }

    const query = new Category(req.body);

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
        const query = await Category.findById(req.params.id).exec();
        res.send(query);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/remove', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        res.status(403).end();
        return;
    }

    try {
        await Category.findByIdAndRemove(req.params.id).exec();
        res.end();
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.get('/:id/parent', async function (req, res) {
    res.setHeader('Connection', 'close');

    try {
        const query = await CategoryTree.findOne({
            childId: req.params.id,
        }).exec();
        res.send(query);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/parent', async function (req, res) {
    res.setHeader('Connection', 'close');

    let add = req.query.add;
    let remove = req.query.remove;

    try {
        if (add !== null || add !== undefined) {
            await CategoryTree.updateOne(
                { parentId: add, childId: req.params.id },
                { upsert: true, new: true }
            ).exec();
        }

        if (remove !== null || remove !== undefined) {
            await CategoryTree.deleteMany({
                parentId: remove,
                childId: req.params.id,
            }).exec();
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.get('/:id/children', async function (req, res) {
    res.setHeader('Connection', 'close');

    try {
        const query = await CategoryTree.find({
            parentId: req.params.id,
        }).exec();
        let result = [];
        for (let item of query) {
            result.push(item._id);
        }
        res.send(result);
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/children', async function (req, res) {
    res.setHeader('Connection', 'close');

    let add = req.query.add;
    let remove = req.query.remove;

    try {
        if (add !== null || add !== undefined) {
            if (add.constructor === Array) {
                for (let item of add) {
                    await CategoryTree.updateOne(
                        { parentId: req.params.id, childId: item },
                        { upsert: true, new: true }
                    ).exec();
                }
            } else {
                await CategoryTree.updateOne(
                    { parentId: req.params.id, childId: add },
                    { upsert: true, new: true }
                ).exec();
            }
        }

        if (remove !== null || remove !== undefined) {
            if (add.constructor === Array) {
                for (let item of remove) {
                    await CategoryTree.deleteMany({
                        parentId: req.params.id,
                        childId: item,
                    }).exec();
                }
            } else {
                await CategoryTree.deleteMany({
                    parentId: req.params.id,
                    childId: remove,
                }).exec();
            }
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.get('/tree', async function (req, res) {
    res.setHeader('Connection', 'close');

    res.send(await CategoryTree.find().exec());
});

export default router;
