import express from 'express';
import User from '../models/user.mjs';
import * as Util from './util.mjs';

const router = express.Router();

router.all('/', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!(await Util.isAdminLoggedIn(req))) {
        res.status(403).end();
        return;
    }

    if (Object.keys(req.query).length === 0) {
        res.send(await User.find().exec());
    } else {
        let filter = Util.toFilter(req.query);
        res.send(await User.find(filter).exec());
    }
});

router.post('/checklogin', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (Util.isLoggedIn(req)) {
        res.status(200).send('User is already logged in');
        return
    }
    res.status(400).send('Not logged in');
});

router.post('/login', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (Util.isLoggedIn(req)) {
        res.status(400).send('User is already logged in');
        return;
    }

    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        const query = await User.findOne({
            username: username,
            password: password,
        }).exec();
        if (query) {
            req.session.userId = query._id;

            res.status(200).send();
        } else {
            res.status(400).send('Invalid username or password');
        }
    } else {
        res.status(400).send('Missing username or password');
    }
});

router.post('/logout', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (Util.isLoggedIn(req)) {
        try {
            req.session.destroy();
            res.clearCookie('connect.sid', { path: '/' });
            res.status(200).end();
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        res.status(401).send('No user logged in');
    }
});

router.post('/add', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (Util.isLoggedIn(req) && !(await Util.isAdmin(req))) {
        res.status(403).end();
        return;
    }

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        type: req.body.type,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
    });

    try {
        await newUser.save();
        res.status(200).send(newUser);
    } catch (error) {
        res.status(400).send(error);
        return;
    }
});

router.post('/:id/edit', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if ((await Util.isAdmin(req)) || req.params.id === req.session.userId) {
        const query = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).exec();
        if (query) {
            res.status(200).send(query);
        } else {
            res.status(404).send('User not found');
        }
    } else {
        res.status(400).end();
    }
});

router.post('/:id/remove', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if ((await Util.isAdmin(req)) || req.params.id === req.session.userId) {
        const query = await User.findByIdAndDelete(req.params.id).exec();
        if (query) {
            req.status(200).end();
        } else {
            req.status(400).send('User not found');
        }
    } else {
        res.status(400).end();
    }
});

router.get('/:id', async function (req, res) {
    res.setHeader('Connection', 'close');

    if (!Util.isLoggedIn(req)) {
        res.status(401).end();
        return;
    }

    if ((await Util.isAdmin(req)) || req.params.id === req.session.userId) {
        const queryInfo = await User.findById(req.params.id).exec();
        if (queryInfo) {
            res.status(200).send(queryInfo);
        } else {
            res.status(404).send('User not found');
        }
    } else {
        res.status(400).end();
    }
});

export default router;
