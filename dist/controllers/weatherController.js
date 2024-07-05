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
    const formattedDate = (0, date_fns_1.format)(date, "EEEE, d MMMM yyyy | hh:mm a");
    return formattedDate;
};
const isDay = (timeStamp) => {
    const date = new Date(timeStamp);
    const time = date.getHours();
    const day = time >= 6 && time < 18;
    return day;
};
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
                // console.log("pop ::",populationResponse)
                const populationCount = populationResponse.data.data.populationCounts;
                const populationDetails = populationCount.map((population) => ({
                    year: population.year,
                    count: population.value,
                }));
                populationDetails.sort((a, b) => Number(b.year) - Number(a.year));
                console.log(populationDetails);
                resolve({
                    status: true,
                    message: "Population data fetched",
                    data: populationDetails,
                });
            })
                .catch((error) => {
                console.log("pop error :", error.response.data);
                if (error.response && error.response.data && error.response.data.error) {
                    resolve({
                        status: false,
                        message: `No population data found for ${city}`,
                        data: error.response.data.msg,
                    });
                }
                else {
                    reject({
                        status: false,
                        message: `No population data found for ${city}`,
                        data: error.response ? error.response.data : error.message,
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
const fetchWeather = (city) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('FETCH WEATHER');
    try {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(`http://api.weatherapi.com/v1/forecast.json?q=${city}&key=${constants_1.API_KEY}&days=5`)
                .then((weatherResponse) => {
                const location = weatherResponse.data.location;
                const currentWeather = weatherResponse.data.current;
                const forecast = weatherResponse.data.forecast;
                const dayNight = isDay(location.localtime);
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
                const formattedDateTime = formatDateTime(location.localtime);
                fetchPopulation(city).then((populationData) => {
                    console.log(populationData);
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
                    location.time = formattedDateTime;
                    location.isDay = dayNight;
                    resolve({
                        status: true,
                        message: "weather fetched but no population data",
                        data: {
                            location: location,
                            currentWeather: currentWeather,
                            forecast: newForecast,
                            population: {
                                status: false,
                                message: "no population data",
                                data: null
                            }
                        }
                    });
                });
            })
                .catch((error) => {
                console.log(error);
                //   console.log("Error :", error);
                reject({
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
module.exports = { fetchWeather, fetchPopulation };
