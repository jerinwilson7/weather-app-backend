"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const date_fns_1 = require("date-fns");
const formatDateTime = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = (0, date_fns_1.format)(date, 'EEEE, d MMMM yyyy | hh:mm a');
    return formattedDate;
};
const isDay = (timeStamp) => {
    const date = new Date(timeStamp);
    const time = date.getHours();
    const day = time >= 6 && time < 18;
    return day;
};
const fetchWeather = (city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("FETCH-WEATHER | WEATHER CONTROLLER");
        const weatherResponse = yield axios_1.default.get(`http://api.weatherapi.com/v1/current.json?q=${city}&key=${constants_1.API_KEY}`);
        const location = weatherResponse.data.location;
        const currentWeather = weatherResponse.data.current;
        console.log('first');
        console.log(isDay(location.localtime));
        const dayNight = isDay(location.localtime);
        const formattedDateTime = formatDateTime(location.localtime);
        location.time = formattedDateTime;
        location.isDay = dayNight;
        return {
            status: true,
            data: { location: location, currentWeather: currentWeather, },
            message: 'city fetched successfully'
        };
    }
    catch (error) {
        console.log("error :", error);
    }
});
module.exports = { fetchWeather };
