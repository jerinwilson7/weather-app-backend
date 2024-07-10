"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const cors_1 = __importDefault(require("cors"));
// const cors = require('cors')
const app = (0, express_1.default)();
const PORT = 8080;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'options'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use("/details", indexRoute_1.default);
app.use(express_1.default.json());
app.use(() => {
    throw (0, http_errors_1.default)(404, "Route Not Found");
});
const errorHandler = (err, req, res, next) => {
    console.log(err.message, err.statusCode);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.statusCode || 500).json({ message: err.message || 'An unknown Error' });
};
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
