
type condition={
    text:string;
    icon:string;
}

type Day = {
    maxtemp_c:number
    mintemp_c:number;
    condition:condition
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