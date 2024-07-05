import { Router } from "express";


const {fetchWeather} = require('../controllers/weatherController')


const router = Router()


router.get('/',async(req,res)=>{
    console.log("Api")
   
    try {
        const city = String(req.query.city) || 'Default City';
        console.log(city)
        const response = await fetchWeather(city)
       
       return res.json({
            status:response.status,
            message: response.message,
            data: response.data
        });
    } catch (error:unknown) {
        console.log('sdfsdf')
        return  res.json({
            status:500,
            message:'Internal Server Error',
            data:(error as Error).message
        })
        // console.error('Error handling request:', error);
    }
}) 
    
export default router     