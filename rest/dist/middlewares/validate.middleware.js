"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message.toLowerCase()}`,
                }));
                res.status(400).json({
                    message: errorMessages[0].message,
                });
                return;
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    };
}
