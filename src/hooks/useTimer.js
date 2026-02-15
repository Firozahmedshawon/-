import { useState, useEffect } from 'react';

export const useTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      if (onTimeUp) onTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  const reset = (time) => {
    setIsActive(false);
    setTimeLeft(time || initialTime);
  };

  return { timeLeft, start, stop, reset };
};