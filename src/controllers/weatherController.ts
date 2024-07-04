import axios from 'axios'
import { API_KEY } from '../constants'
import { format } from 'date-fns'


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

const fetchWeather = async(city:string)=>{
    try {
        console.log("FETCH-WEATHER | WEATHER CONTROLLER")
        
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?q=${city}&key=${API_KEY}`)


        const location = weatherResponse.data.location
        const currentWeather = weatherResponse.data.current

        console.log('first')
        console.log(isDay(location.localtime))

        const dayNight = isDay(location.localtime)


        const formattedDateTime = formatDateTime(location.localtime);
        location.time = formattedDateTime
        location.isDay = dayNight
    
        return{ 
            status:true, 
            data:{location:location,currentWeather:currentWeather,},   
            message:'city fetched successfully' 
        }  
    } catch (error) {  
        console.log("error :",error)      
    }  
    
}  
      


module.exports = {fetchWeather}  