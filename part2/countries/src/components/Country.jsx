import { useState, useEffect } from "react"
import axios from 'axios'
const api_key = import.meta.env.VITE_WEATHER_KEY

const Country = ({ country }) => {
    const [weatherData, setWeatherData] = useState(null)

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&APPID=${api_key}`)
            .then(response => setWeatherData(response.data))
            .catch(error => console.log('Error:', error))
    }, [country])

    return (
        <div>
            <div>
                <h1>{country.name.common}</h1>
                <p>
                    capital {country.capital}<br />
                    area {country.area}
                </p>
            </div>
            <div>
                <h3>languages:</h3>
                <ul>
                    {Object.entries(country.languages).map(([key, value]) => <li key={key}>{value}</li>)}
                </ul>
            </div>
            <div>
                <img src={country.flags.png} width="10%" height="10%" />
            </div>
            {weatherData &&
                <div>
                    <h2>Weather in {weatherData.name}</h2>
                    <p>
                        temperature {(weatherData.main.temp - 273).toFixed(2)} Celsius <br />
                        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} /> <br />
                        wind {weatherData.wind.speed} m/s
                    </p>
                </div>
            }
        </div>
    )
}

export default Country