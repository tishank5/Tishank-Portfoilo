import { useEffect, useState } from "react";
import { LocationInfo } from "./LocationInfo";

export const Header = () => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="header-component">
      <div className={`logo ${showLogo ? 'show' : ''}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            className="s"
            d="M8 8L16 16M16 16L24 8M16 16L8 24M16 16L24 24" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path 
            className="w1"
            d="M4 12L12 4M20 4L28 12M4 20L12 28M20 28L28 20" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      <LocationInfo />

      <div className="about text-xs">
        v2.0.0
      </div>
    </header>
  );
};
