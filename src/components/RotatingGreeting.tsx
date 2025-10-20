import { useEffect, useState } from "react";

const greetings = [
  "Namaste",      // Hindi
  "Nomoshkar",    // Bengali
  "Vanakkam",     // Tamil
  "Namaskara",    // Kannada
  "Sat Sri Akal", // Punjabi
  "Hello",        // English
  "こんにちは",   // Japanese
  "안녕하세요",   // Korean
  "Hola",         // Spanish
  "Bonjour",      // French
  "Ciao",         // Italian
  "Hallo",        // German
  "Olá",          // Portuguese
  "Здравствуйте", // Russian
  "你好",         // Chinese
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
