import { format } from "date-fns";



export const isDay = (timeStamp: string) => {
    const date = new Date(timeStamp);
    const time = date.getHours();
    const day = time >= 6 && time < 18;
    return day;
  };


  export const formatDateTime = (timeStamp: string) => {
    const date = new Date(timeStamp);
    const formattedDate = format(date, "EEEE, d MMMM yyyy | hh:mm a");
    return formattedDate;
  };


