import express, { ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import  indexRouter from './routes/indexRoute'
import cors from 'cors'

// const cors = require('cors')

const app = express();


const PORT = 8080

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST','options'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use("/details",indexRouter)


app.use(express.json());

app.use(()=>{
    throw createHttpError(404,"Route Not Found")
})

const errorHandler:ErrorRequestHandler = (err,req,res,next)=>{
    console.log(err.message,err.statusCode)
    if(res.headersSent){
        return next(err)
    }
    res.status(err.statusCode || 500).json({message:err.message || 'An unknown Error'})
}

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})