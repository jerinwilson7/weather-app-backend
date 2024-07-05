"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateTime = exports.isDay = void 0;
const date_fns_1 = require("date-fns");
const isDay = (timeStamp) => {
    const date = new Date(timeStamp);
    const time = date.getHours();
    const day = time >= 6 && time < 18;
    return day;
};
exports.isDay = isDay;
const formatDateTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = (0, date_fns_1.format)(date, "EEEE, d MMMM yyyy | hh:mm a");
    return formattedDate;
};
exports.formatDateTime = formatDateTime;
