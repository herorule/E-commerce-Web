import express from 'express';
import { Order, OrderItem } from '../models/order.mjs';
import * as Util from './util.mjs';

const router = express.Router();

router.get('/', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if ((await Util.isAdmin(req)) || req.query.userId === req.session.userId) {
        if (Object.keys(req.query).length === 0) {
            res.send(await Order.find().exec());
        } else {
            let filter = Util.toFilter(req.query);
            res.send(await Order.find(filter).exec());
        }
    } else {
        res.status(403).end();
    }
});

router.post('/add', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if ((await Util.isAdmin(req)) || req.body.userId === req.session.userId) {
        const query = new Order(req.body);

        try {
            await query.save();
            res.send(query._id);
        } catch (e) {
            res.status(400).send(e.message);
        }
    } else {
        res.status(403).end();
    }
});

router.get('/:id', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            res.send(query);
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            res.send(
                await Order.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true }
                ).exec()
            );
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/remove', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();
        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            await Order.deleteOne({ _id: req.params.id }).exec();
            res.end();
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.get('/:id/item', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            res.send(await OrderItem.find({ orderId: req.params.id }).exec());
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/add', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            const item = new OrderItem({
                orderId: req.body.orderId,
                productId: req.body.productId,
                price: req.body.price,
                discount: req.body.discount,
                quantity: req.body.quantity,
            });
            await item.save();
            res.end();
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.get('/:id/:iid', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            res.send(await OrderItem.findById(req.params.iid).exec());
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/:iid/edit', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            const itemQuery = Order.findByIdAndUpdate(
                req.params.iid,
                { $set: req.body },
                { upsert: true, new: true }
            ).exec();
            res.send(itemQuery);
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/:id/:iid/remove', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    try {
        const query = await Order.findById(req.params.id).exec();

        if ((await Util.isAdmin(req)) || query._id === req.session.userId) {
            const itemQuery = Order.findByIdAndRemove(req.params.iid).exec();
            res.end();
        } else {
            res.status(403).end();
        }
    } catch (e) {
        res.status(404).send(e.message);
    }
});

export default router;
