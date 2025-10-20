
import { useState, useEffect } from "react";
import { generateRealisticTemperature } from "../utils/temperature";

type TemperatureUnit = 'C' | 'F';

export const TimeDisplay = () => {
  const [time, setTime] = useState<string>("");
  const [city, setCity] = useState<string>("Your City");
  const [temperature, setTemperature] = useState<string>("--°");
  const [temperatureValue, setTemperatureValue] = useState<number | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [isEditingCity, setIsEditingCity] = useState<boolean>(false);
  const [tempCity, setTempCity] = useState<string>("");
  
  // Format time as HH:MM AM/PM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Update time every second
  useEffect(() => {
    setTime(formatTime(new Date()));
    
    const timeInterval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // Initialize with timezone-based location and temperature on component mount
  useEffect(() => {
    // Use timezone to guess location
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let cityFromTimezone = timezone.split('/').pop()?.replace(/_/g, ' ') || "Your City";
      
      // Clean up the city name
      if (cityFromTimezone.includes('/')) {
        cityFromTimezone = cityFromTimezone.split('/').pop() || "Your City";
      }
      
      setCity(cityFromTimezone);
      setTempCity(cityFromTimezone);
    } catch (err) {
      setCity("Your City");
      setTempCity("Your City");
    }
    
    // Generate a realistic temperature
    const month = new Date().getMonth();
    const isSummer = (month >= 3 && month <= 8);
    const baseTemp = isSummer ? 25 : 10;
    const mockTemp = Math.round(baseTemp + (Math.random() * 10 - 5));
    setTemperatureValue(mockTemp);
    setTemperature(`${mockTemp}°${unit}`);
  }, []);

  // Update temperature display when temperature value or unit changes
  useEffect(() => {
    if (temperatureValue !== null) {
      if (unit === 'F') {
        // Convert Celsius to Fahrenheit
        const fahrenheit = Math.round(temperatureValue * 9/5 + 32);
        setTemperature(`${fahrenheit}°F`);
      } else {
        setTemperature(`${temperatureValue}°C`);
      }
    }
  }, [temperatureValue, unit]);

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  // Handle city name submission
  const handleSubmitCity = () => {
    if (tempCity.trim()) {
      setCity(tempCity);
    } else {
      setTempCity(city);
    }
    setIsEditingCity(false);
  };

  // Handle city name change
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempCity(e.target.value);
  };

  // Handle keyboard events for city name input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitCity();
    } else if (e.key === 'Escape') {
      setIsEditingCity(false);
      setTempCity(city);
    }
  };

  return (
    <div className="flex flex-col items-center text-white">
      <h1 className="mb-2">{time}</h1>
      
      {isEditingCity ? (
        <div className="mb-4 relative">
          <input
            type="text"
            value={tempCity}
            onChange={handleCityChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSubmitCity}
            autoFocus
            className="bg-black/30 text-white text-center px-4 py-2 rounded-lg backdrop-blur-sm border-0 shadow-inner"
            placeholder="Enter your city"
          />
        </div>
      ) : (
        <h2 
          className="mb-4 cursor-pointer hover:underline underline-offset-4" 
          onClick={() => setIsEditingCity(true)}
          title="Click to edit location"
        >
          {city}
        </h2>
      )}
      
      <h3 
        className="cursor-pointer hover:underline underline-offset-4"
        onClick={toggleTemperatureUnit}
        title="Click to toggle between °C and °F"
      >
        {temperature}
      </h3>
    </div>
  );
};
