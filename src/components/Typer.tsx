import { useState, useEffect } from "react";

interface TyperProps {
  text: string;
  speed?: number;
}

export const Typer = ({ text, speed = 50 }: TyperProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`greeting-component ${isComplete ? 'done' : ''}`}>
      <span>{displayedText}</span>
      <span className="cursor"></span>
    </span>
  );
};
