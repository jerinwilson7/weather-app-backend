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
const utils_1 = require("../utils");
//* RESPONSIBLE FOR FETCHING POPULATION API
const fetchPopulation = (city) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('FETCH POPULATION');
    const reqBody = {
        city: city,
    };
    try {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${constants_1.POPULATION_API}`, reqBody)
                .then((populationResponse) => {
                const populationCount = populationResponse.data.data.populationCounts;
                const populationDetails = populationCount.map((population) => ({
                    year: population.year,
                    count: population.value,
                }));
                populationDetails.sort((a, b) => Number(b.year) - Number(a.year));
                resolve({
                    status: true,
                    message: "Population data fetched",
                    data: populationDetails,
                });
            })
                .catch((error) => {
                // * HANDLE ERROR IF NO POPULATION DATA IS FOUND FOR THE CITY PASSED
                if (error.response.data.error) {
                    resolve({
                        status: false,
                        message: `No population data found for ${city}`,
                        data: error.response.data.msg,
                    });
                }
            });
        });
    }
    catch (error) {
        console.log(error);
        return ({
            data: error.message,
            status: false,
            message: `No population data found for ${city}`,
        });
    }
});
//* RESPONSIBLE FOR FETCHING WEATHER API AND INVOKING FUCTION THAT FETCHES POPULATION
const fetchWeather = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('FETCH WEATHER');
    try {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(data.city ?
                `http://api.weatherapi.com/v1/forecast.json?q=${data.city}&key=${constants_1.API_KEY}&days=5` :
                `http://api.weatherapi.com/v1/forecast.json?q=${Number(data.latitude)},${Number(data.longitude)}&key=${constants_1.API_KEY}&days=5`)
                .then((weatherResponse) => {
                const location = weatherResponse.data.location;
                const currentWeather = weatherResponse.data.current;
                const forecast = weatherResponse.data.forecast;
                const dayNight = (0, utils_1.isDay)(location.localtime);
                const newForecast = forecast.forecastday.map((day) => ({
                    currentDay: (0, date_fns_1.format)(day.date, "eeee"),
                    date: day.date,
                    day: {
                        maxtemp: day.day.maxtemp_c,
                        mintemp: day.day.mintemp_c,
                        condition: {
                            text: day.day.condition.text,
                            icon: day.day.condition.icon,
                        },
                    },
                }));
                const formattedDateTime = (0, utils_1.formatDateTime)(location.localtime);
                fetchPopulation(location.name).then((populationData) => {
                    location.time = formattedDateTime;
                    location.isDay = dayNight;
                    resolve({
                        status: true,
                        message: "Weather fetched successfully",
                        data: {
                            location: location,
                            currentWeather: currentWeather,
                            forecast: newForecast,
                            population: populationData,
                        },
                    });
                })
                    .catch((error) => {
                    console.log('error :', error);
                    resolve({
                        status: false,
                        message: "Error fetching",
                        data: error
                    });
                });
            })
                .catch((error) => {
                console.log(error);
                resolve({
                    status: false,
                    message: "Unable to fetch weather data",
                    data: error.message,
                });
            });
        });
    }
    catch (error) {
        console.log("error", error);
        throw error;
    }
});
module.exports = { fetchWeather };
