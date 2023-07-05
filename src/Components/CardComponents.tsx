import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import {Card, Col, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CardComponents.css"

import {cacheExpiryTime,url} from './Constant';

export interface WeatherData {
    name: string;
    wind:{speed:string,deg:string};
    weather: { description: string}[];
    main: { temp: number; pressure: number,temp_min:number,temp_max:number,humidity:number };
    visibility: number;
    sys: { sunrise: number; sunset: number,country:string };
    dateTime:{formattedDate:string,formattedTime:string};
    image: string;

}
function TimeAndDate(){
    // Get the current date and time
    const currentDate = new Date();

// Extract the hours and minutes
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

// Determine if it's AM or PM
    const amOrPm = hours >= 12 ? 'pm' : 'am';

// Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

// Format the time in "hh.mm" format
    const formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + amOrPm;

// Extract the month and day
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const day = currentDate.getDate();

// Format the date in "Month day" format
    const formattedDate = month + ' ' + day;

    // Return the formatted date and time
    return { formattedDate, formattedTime };
}

function WeatherInformation() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [isCacheExpired, setCacheExpired] = useState<boolean>(true);



    const fetchData = () => {

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.list);

                // Get the formatted date and time
                const { formattedDate, formattedTime } = TimeAndDate();
                const updatedWeatherData = data.list.map((item: WeatherData) => ({
                    ...item,
                    dateTime: { formattedDate, formattedTime },
                }));

                // Store data in cache with timestamp
                const cacheData = {
                    timestamp: new Date().getTime(),
                    data: updatedWeatherData,

                };
                localStorage.setItem("weatherData", JSON.stringify(cacheData));
                // Update the weatherData state with the dateTime values

                setWeatherData(updatedWeatherData);
                setCacheExpired(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleButtonClick = () => {
        const cachedData = localStorage.getItem("weatherData");
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (
                parsedData.timestamp &&
                new Date().getTime() - parsedData.timestamp < cacheExpiryTime
            ) {
                setWeatherData(parsedData.data);
                setCacheExpired(false);
                return;
            }
        }

        // Fetch new data
        fetchData();
    };

    useEffect(() => {
        // Check if cached data exists and if cache is expired
        const cachedData = localStorage.getItem("weatherData");
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (
                parsedData.timestamp &&
                new Date().getTime() - parsedData.timestamp < 3 * 60 * 1000
            ) {
                setWeatherData(parsedData.data);
                //setWeatherData(parsedData.dateTime)
                setCacheExpired(false);
                return;
            }
        }

        // Fetch new data
        fetchData();
    }, []);

    return (
        <>
            <Button variant="outline-dark" onClick={handleButtonClick} className="button">Refresh</Button>{' '}


            <Row>
                {weatherData.map((weather, index) => (
                    <Col className="key" key={index} xs={12} sm={6} md={6} lg={5}>
                       <WeatherInfo weather={weather} />
                        
                    </Col>

                    ))}
            </Row>

        </>
    );

}

function WeatherInfo({ weather }: { weather: WeatherData }) {
    const {
        weather: weatherDescription,
        sys: { sunrise, sunset },
    } = weather;

    let weatherIcon: string; // Declare the weatherIcon variable

    // Determine the weather icon based on the weather condition
   if (weatherDescription[0].description === 'overcast clouds') {
        weatherIcon = 'src/assets/cloudsOvercast.png';
    } else if (weatherDescription[0].description === 'broken clouds') {
        weatherIcon = 'src/assets/brokenClouds.png';
    } else if (weatherDescription[0].description === 'clear sky') {
        weatherIcon = 'src/assets/clear.png';
    } else if (weatherDescription[0].description === 'few clouds') {
        weatherIcon = 'src/assets/fewClouds.png';
    } else if (weatherDescription[0].description === 'light rain') {
        weatherIcon = 'src/assets/drizzle.png';
    }else if (weatherDescription[0].description === 'thunderstorm') {
        weatherIcon = 'src/assets/thunderstorm.png';
    }
    else if (weatherDescription[0].description === 'moderate rain') {
        weatherIcon = 'src/assets/moderateRain.png';
    }else if (weatherDescription[0].description === 'heavy intensity rain') {
        weatherIcon = 'src/assets/heavyRain1.png';}
    else {
        weatherIcon = 'src/assets/default.png'; // Default icon if no specific condition matches
    }
    let image;

    for (let i=0;i<5;i++) {
        if (weather.name=="Colombo") {
            image = "src/assets/image8.jpg";
        } else if (weather.name=="Tokyo") {
            image = "src/assets/image3.jpg"
        } else if (weather.name=="Liverpool") {
            image = "src/assets/image5.jpg"
        } else if (weather.name=="Sydney") {
            image = "src/assets/image2.jpg"
        } else{
            image = "src/assets/image7.jpg"
        }
    }
    // Convert sunrise UNIX timestamp to formatted time string
    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

    // Convert sunset UNIX timestamp to formatted time string
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });


    return (
        <div className="container">
        <div className="row">
            <div className="col-20">
        <Row  className="g-4">
            {Array.from({length: 1}).map((_, idx) => (
                <Col key={idx}>
                    <Card className="card">
                    <div>
                        <div className="top-high">
                            <img src={image} className="icon" alt="background image"/>
                            <div className="top">
                                <div className="top1">
                            <h2 className="city">{weather.name}, {weather.sys.country}</h2>
                            <h1 id="datetime" >{weather.dateTime.formattedTime}, {weather.dateTime.formattedDate} </h1>
                                    <div className="weather">
                            <img src={weatherIcon} className="weather-icon" alt="weather icons"/>
                            <p className="description">{weatherDescription[0].description}</p>
                                    </div>
                                </div>
                                <div className="top2">
                            <p className="temp">{weather.main.temp}°C</p>
                            <p className="tempMin">Temp Min:{" "+weather.main.temp_min}°C</p>
                            <p className="tempMax">Temp Max:{" "+weather.main.temp_max}°C</p>
                                </div>
                            </div>
                            </div>
                            <div className="footer1">
                                <div className="inner1">
                                    <p>Pressure: {weather.main.pressure}hPa</p>
                                    <p>Humidity: {weather.main.humidity}%</p>
                                    <p>Visibility: {weather.visibility / 1000}km</p>
                                </div>
                                <div className="line"></div>
                                <div className="inner3">
                                    <img src="src/assets/icon.png" className="icon1" alt="weather icons"/>
                                    <p className="wind">{weather.wind.speed}m/s {weather.wind.deg} Degree</p></div>
                                <div className="line"></div>
                                <div className="inner2">
                                    <p>Sunrise: {sunriseTime}</p>
                                    <p>Sunset: {sunsetTime}</p>
                                </div>

                            </div>
                         </div>

                    </Card>
                </Col>

            ))}

        </Row>

        </div>
        </div>
        </div>

    );
}

export default WeatherInformation;
