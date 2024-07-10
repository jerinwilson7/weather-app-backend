
type Condition={
    text:string;
    icon:string;
}

type Day = {
    maxtemp_c:number
    mintemp_c:number;
    condition:Condition
}


export type ForcastType = {
    currentDay:string
    date:string;
    day:Day
}     


export type PopulationType ={
    year:string,
    value:string
}

export type WeatherDataType={
    city?:string
    latitude?: number,
    longitude?: number,
}   