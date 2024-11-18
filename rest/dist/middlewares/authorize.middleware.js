"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (authorizedUser) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new Error('Empty user data');
        }
        const role = req.user.userType;
        if (!authorizedUser.includes(role)) {
            return res.status(403).send('Forbidden');
        }
        next();
    };
};
exports.authorize = authorize;
