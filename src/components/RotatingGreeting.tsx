import { useEffect, useState } from "react";

const greetings = [
  "Namaste",      // Hindi
    "Hello",      // English
  "Namaskar",     // Marathi
  "Nomoshkar",    // Bengali
  "Vanakkam",     // Tamil
  "Namaskara",    // Kannada
  "Sat Sri Akal", // Punjabi
  "Konnichiwa",   // Japanese
  "Annyeonghaseyo", // Korean
  "Hola",         // Spanish
  "Ciao",         // Italian
  "Hallo",        // German
  "مرحبا",        // Arabic
];

export const RotatingGreeting = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % greetings.length);
        setIsVisible(true);
      }, 500); // Wait for fade out before changing text
    }, 3000); // Change every 3 seconds

    return () => clearInterval(rotateInterval);
  }, []);

  return (
    <div 
      className="greeting-component text-2xl mb-12 transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {greetings[currentIndex]}
    </div>
  );
};
