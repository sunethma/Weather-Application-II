export const cityCodes = ["1248991", "1850147", "2644210", "2147714", "4930956"];


export const cacheExpiryTime = 3 * 60 * 1000;

export  const url = `https://api.openweathermap.org/data/2.5/group?id=${cityCodes.join(
    ","
)}&units=metric&appid=${import.meta.env.VITE_REACT_API_KEY}`;



