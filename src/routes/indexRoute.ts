import { Router } from "express";


const {fetchWeather} = require('../controllers/weatherController')


const router = Router()


router.get('/',async(req,res,next)=>{    
    console.log("Api")
   
    try {
        const data = req.query.data;
        console.log(data)
        const response =  await fetchWeather(data)
       
       return res.json({   
            status:response.status,
            message: response.message,
            data: response.data
        });
    } catch (error:unknown) { 
        next(error)
        // return  res.json({
        //     status:500,
        //     message:'Internal Server Error',
        //     data:(error as Error).message
        // })
    }
}) 
    
export default router                          