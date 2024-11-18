"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = getBaseUrl;
function getBaseUrl(req) {
    return `${req.protocol}://${req.get('host')}`;
}
