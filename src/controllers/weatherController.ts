import axios from 'axios'
import { API_KEY, POPULATION_API } from '../constants'
import { format } from 'date-fns'
import { ForcastType, PopulationType } from '../@types'


const formatDateTime = (timeStamp:string)=>{
    const date = new Date(timeStamp)
    const formattedDate = format(date,'EEEE, d MMMM yyyy | hh:mm a')
    return formattedDate
}

const isDay = (timeStamp:string)=>{
    const date = new Date(timeStamp)
    const time = date.getHours()
    const day = time >=6 && time < 18
    return day
}


const fetchPopulation = async(city:string)=>{
    const reqBody = {
        city:city
    }
    try {
        
        const populationResponse = await axios.post(`${POPULATION_API}`,reqBody)
        const populationCount = populationResponse.data.data.populationCounts
        const populationDetails = populationCount.map((population:PopulationType)=>(
            {
                year:population.year,
                count:population.value
            }
        ))
        return {
            status:true,
            data:populationDetails,
            message:"population fetched"
        }

  
    } catch (error:unknown) {  
        console.log('error :',error)
        return {
            status:false,
            message:'No population data found',
            data:(error as Error).message
        } 
    }  
}

   
 
 
 

const fetchWeather = async(city:string)=>{
    try {
        console.log("FETCH-WEATHER | WEATHER CONTROLLER")
        
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/forecast.json?q=${city}&key=${API_KEY}&days=5`)


        const location = weatherResponse.data.location
        const currentWeather = weatherResponse.data.current
        const forecast = weatherResponse.data.forecast

        console.log('first')
        console.log(isDay(location.localtime))

        const dayNight = isDay(location.localtime)

        const newForecast = forecast.forecastday.map((day:ForcastType)=>(
            {
              currentDay:format(day.date,'eeee'),  
              date:day.date,
              day: {
                maxtemp:day.day.maxtemp_c,
                mintemp:day.day.mintemp_c,
                condition:{
                    text:day.day.condition.text, 
                    icon:day.day.condition.icon
                } 
              }
        }))

  
        const formattedDateTime = formatDateTime(location.localtime);
        const population = await fetchPopulation(city)
 
        location.time = formattedDateTime
        location.isDay = dayNight  
     
        return{ 
            status:true, 
            data:{location:location,currentWeather:currentWeather,forecast:newForecast,population:population},   
            message:'Weather fetched successfully' 
        }  
    } catch (error:unknown) {  
        return {
            status:false,
            message:"Unable fetch data",
            data:(error as Error).message,
        }    
    }   
    
}    
        
  
  

module.exports = {fetchWeather,fetchPopulation}       