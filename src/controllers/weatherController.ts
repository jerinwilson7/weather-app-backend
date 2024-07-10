import axios from "axios";
import { API_KEY, POPULATION_API } from "../constants";
import { format } from "date-fns";
import { ForcastType, PopulationType, WeatherDataType,  } from "../@types";
import { formatDateTime, isDay } from "../utils";




//* RESPONSIBLE FOR FETCHING POPULATION API

const fetchPopulation = async (city: string) => {

    console.log('FETCH POPULATION') 
 
  const reqBody = {   
    city: city,  
  };  
         
  try {  
    return new Promise((resolve, reject) => { 
      axios 
        .post(`${POPULATION_API}`, reqBody) 
        .then((populationResponse) => { 
           
          const populationCount = populationResponse.data.data.populationCounts;
          const populationDetails = populationCount.map(
            (population: PopulationType) => ({
              year: population.year,
              count: population.value,
            })
          ); 

  
 
 
          populationDetails.sort((a: PopulationType, b: PopulationType) => Number(b.year) - Number(a.year));

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
      } catch (error: unknown) {
        console.log(error);
        return ({
          data: (error as Error).message,
          status: false,
          message: `No population data found for ${city}`,
        });
      } 
    };
 
  
       
  
   

//* RESPONSIBLE FOR FETCHING WEATHER API AND INVOKING FUCTION THAT FETCHES POPULATION
 
const fetchWeather = async (data:WeatherDataType) => { 

    console.log('FETCH WEATHER')
 
  try {
    return new Promise((resolve, reject) => {
 
      axios
        .get(data.city?
          `http://api.weatherapi.com/v1/forecast.json?q=${data.city}&key=${API_KEY}&days=5`:
          `http://api.weatherapi.com/v1/forecast.json?q=${Number(data.latitude)},${Number(data.longitude)}&key=${API_KEY}&days=5`
         
        )
        .then((weatherResponse) => {
          const location = weatherResponse.data.location;
          const currentWeather = weatherResponse.data.current;
          const forecast = weatherResponse.data.forecast; 



          const dayNight = isDay(location.localtime);
 
          const newForecast = forecast.forecastday.map((day: ForcastType) => ({
            currentDay: format(day.date, "eeee"),  
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
          .catch((error)=>{
           console.log('error :',error) 

           resolve({
            status: false,
            message: "Error fetching",
            data:error
           })
          })
        })  

        .catch((error) => {
            console.log(error)
          resolve({
            status: false,
            message: "Unable to fetch weather data",
            data: error.message, 
          });
        });
    });
  } catch (error) {
    console.log("error", error);
    throw error
  }  
}; 
  
module.exports = { fetchWeather };

