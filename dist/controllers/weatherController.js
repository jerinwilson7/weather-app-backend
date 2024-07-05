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
const fetchPopulation = (city) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = {
        city: city
    };
    try {
        const populationResponse = yield axios_1.default.post(`${constants_1.POPULATION_API}`, reqBody);
        const populationCount = populationResponse.data.data.populationCounts;
        const populationDetails = populationCount.map((population) => ({
            year: population.year,
            count: population.value
        }));
        return {
            status: true,
            data: populationDetails,
            message: "population fetched"
        };
    }
    catch (error) {
        console.log('error :', error);
        return {
            status: false,
            message: 'No population data found',
            data: error.message
        };
    }
});
const fetchWeather = (city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("FETCH-WEATHER | WEATHER CONTROLLER");
        const weatherResponse = yield axios_1.default.get(`http://api.weatherapi.com/v1/forecast.json?q=${city}&key=${constants_1.API_KEY}&days=5`);
        const location = weatherResponse.data.location;
        const currentWeather = weatherResponse.data.current;
        const forecast = weatherResponse.data.forecast;
        console.log('first');
        console.log(isDay(location.localtime));
        const dayNight = isDay(location.localtime);
        const newForecast = forecast.forecastday.map((day) => ({
            currentDay: (0, date_fns_1.format)(day.date, 'eeee'),
            date: day.date,
            day: {
                maxtemp: day.day.maxtemp_c,
                mintemp: day.day.mintemp_c,
                condition: {
                    text: day.day.condition.text,
                    icon: day.day.condition.icon
                }
            }
        }));
        const formattedDateTime = formatDateTime(location.localtime);
        const population = yield fetchPopulation(city);
        location.time = formattedDateTime;
        location.isDay = dayNight;
        return {
            status: true,
            data: { location: location, currentWeather: currentWeather, forecast: newForecast, population: population },
            message: 'Weather fetched successfully'
        };
    }
    catch (error) {
        return {
            status: false,
            message: "Unable fetch data",
            data: error.message
        };
    }
});
module.exports = { fetchWeather, fetchPopulation };
