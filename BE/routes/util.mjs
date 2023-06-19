import User from '../models/user.mjs';

export function isLoggedIn(req) {
    return req.session.userId ? true : false;
}

export async function isAdmin(req) {
    const query = await User.findById(req.session.userId).exec();
    return query && query.type === 'Admin' ? true : false;
}

export async function isAdminLoggedIn(req) {
    return isLoggedIn(req) && (await isAdmin(req));
}

export function toFilter(obj) {
    let filter = {};
    for (let key in obj) {
        if (key === 'id') {
            filter['_id'] = obj.id;
        } else {
            filter[key] = obj[key];
        }
    }
    return filter;
}
