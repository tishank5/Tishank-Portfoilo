
import React, { useEffect, useState } from "react";

export const LocationInfo = () => {
  const [city, setCity] = useState<string>("Loading city...");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

  // Get location and weather data
  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      useFallbackLocation();
      return;
    }

    // Define timeout for geolocation request
    const geolocationTimeout = setTimeout(() => {
      console.log("Geolocation request timed out");
      useFallbackLocation();
    }, 5000); // 5 second timeout

    // Geolocation options
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 600000 // 10 minutes
    };

    // Request geolocation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(geolocationTimeout);
        
        try {
          const { latitude, longitude } = position.coords;
          
          // Try to get actual city name using reverse geocoding API
          try {
            // Using OpenStreetMap's free Nominatim API for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'Portfolio-Website'
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              const city = data.address?.city || 
                          data.address?.town || 
                          data.address?.village || 
                          data.address?.county ||
                          data.address?.state ||
                          "Your City";
              setCity(city);
            } else {
              throw new Error("Geocoding API failed");
            }
          } catch (err) {
            console.warn("Could not determine city from coordinates, using timezone:", err);
            // Fallback to timezone method
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let cityFromTimezone = timezone.split('/').pop()?.replace(/_/g, ' ') || "Your City";
            
            if (cityFromTimezone.includes('/')) {
              cityFromTimezone = cityFromTimezone.split('/').pop() || "Your City";
            }
            
            setCity(cityFromTimezone);
          }
          
          setLoading(false);
        } catch (err) {
          console.error("Error processing location data:", err);
          useFallbackLocation();
        }
      },
      (err) => {
        clearTimeout(geolocationTimeout);
        console.error("Geolocation error:", err.code, err.message);
        useFallbackLocation();
      },
      options
    );
  }, []);
  
  // Fallback when geolocation fails
  const useFallbackLocation = () => {
    setLoading(false);
    
    // Try to get city name from timezone
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let cityFromTimezone = timezone.split('/').pop()?.replace(/_/g, ' ') || "Your City";
      
      // Further clean up
      if (cityFromTimezone.includes('/')) {
        cityFromTimezone = cityFromTimezone.split('/').pop() || "Your City";
      }
      
      setCity(cityFromTimezone);
    } catch (err) {
      setCity("Your City");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white text-xs opacity-60">
        <span>{time}</span>
        <span>•</span>
        <span>Locating...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-white text-xs opacity-80">
      <span>{time}</span>
      <span>•</span>
      <span>{city}</span>
    </div>
  );
};
