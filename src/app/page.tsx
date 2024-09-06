import Image from "next/image";
import WeatherWidget from "@/components/weather-widget";

export default function Home() {
  return (
    
      <div className="h-screen bg-blue-50 bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/storm-weather-forecast-collage-variety-weather-conditions-with-rain-lightning_1014870-64676.jpg?w=996')" }}>
      <WeatherWidget/>
    </div>
  );
}
