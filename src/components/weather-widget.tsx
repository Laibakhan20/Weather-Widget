"use client";
import { useState, ChangeEvent, FormEvent } from "react"; // Import necessary hooks and types from React
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react"; //import icons from lucide-react
import { get } from "http";

// Define a TypeScript interface for weather data
interface Weatherdata {
  temperature: number;
  humidity: number;
  wind: number;
  description: string;
  location: string;
  unit: string;
}

// Export default function of the weatherwidget component function:
export default function WeatherWidget() {
  // STATE AND REFRENCES

  // State hooks for managing location input, weather data, error messages, and loading state:
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<Weatherdata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // FUNCTIONS FOR FETCHING AND DISPLAYING WEATHER DATA:

  //function to handle the search form submission:
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a location"); // Set error message if location input is empty
      setWeather(null); // Clear previous weather data
      return;
    }
    setIsLoading(true); // Set loading state to true
    setError(null); // Clear any previous error messages

    try {
      // Fetch weather data from the weather API
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );

      if (!response.ok) {
        throw new Error("City not found!");
      }
      const data = await response.json();
      const weatherData: Weatherdata = {
        temperature: data.current.temp_c, // Extract temperature from API response
        humidity: data.current.humidity, // Extract humidity from API response
        wind: data.current.wind_kph, // Extract wind speed from API response
        description: data.current.condition.text, // Extract weather description from API response
        location: data.location.name, // get location name
        unit: "C", // unit for temperature
      };

      setWeather(weatherData); // Set the fetched weather data
    } catch (error) {
      console.error("Error fetching weather data:", error);
      console.error("City not found. Please try again."); // Set error message
      setWeather(null); // Clear previous weather data
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // HELPER FUNCTIONS

  // Function to get a temperature message based on the temperature value and unit:
  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `The temperature is ${temperature}°C. Brrr, it's freezing!`;
      } else if (temperature < 10) {
        return `The temperature is ${temperature}°C. It's pretty cold!.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. It's a bit cool.`;
      } else if (temperature < 30) {
        return `The temperature is ${temperature}°C. Perfect Weather!.`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`; // Placeholder for other temperature units (e.g., Fahrenheit)
    }
  }

  // Function to get a weather message based on the weather description
  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "A bit of cloud cover, but still a great day!";
      case "cloudy":
        return "It's a cloudy today!";
      case "overcast":
        return "It's a bit gloomy today.";
      case "rain":
        return "It's raining today. Better grab an umbrella!";
      case "thunderstorm":
        return "There's a thunderstorm today. Stay safe!";
      case "snow":
        return "It's snowing today. Time to get cozy!";
      case "mist":
        return "It's a bit misty today. Better grab a scarf!";
      case "fog":
        return "It's foggy today. Better slow down!";

      default:
        return description; // Default to returning the description as-is
    }
  }

  // Function to get a location message based on the current time
  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;

    return ` ${location} ${isNight ? "at Night" : "During the Day"}`; // Determine if it's night time
  }

  // JSX RETURN STATEMENT

  // JSX return statement rendering the weather widget UI
  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className=" w-full max-w-md mx-auto text-center bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather conditions in your City.
          </CardDescription>
        </CardHeader>

        {/* Card content including the search form and weather display */}
        <CardContent>
          {/* Form to input and submit the location */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={
                (e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value) // Update location state on input change
              }
            />
            <Button className="bg-white text-black hover:bg-slate-300" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
              {/* Show "Loading..." text while fetching data */}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}{" "}
          {/* Display error message if any */}
          {/* Display weather data if available */}
          {weather && (
            <div className="mt-4 grid gap-2">
              {/* Display temperature message with icon */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </div>
              </div>

              {/* Display weather description message with icon */}
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>

              {/* Display location message with icon */}
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6" />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
