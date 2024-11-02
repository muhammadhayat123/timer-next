"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handlePause = (): void => {
    if (timeLeft > 0) {
      setIsActive(false);
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleResume = (): void => {
    if (isPaused && timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setDuration(value);
    } else {
      setDuration(""); // Reset if invalid
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in">
        Countdown Timer
      </h1>

      {/* Input Section */}
      <div className="flex flex-col items-center mb-6">
        <Input
          type="number"
          value={duration}
          onChange={handleDurationChange}
          placeholder="Set duration (seconds)"
          className="mb-4 px-4 py-2 w-64 text-center border border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <Button
          onClick={handleSetDuration}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition duration-300"
        >
          Set Duration
        </Button>
      </div>

      {/* Timer Display */}
      <div className="text-6xl font-mono text-gray-900 bg-white p-6 rounded-lg shadow-lg mb-8 animate-scale-in">
        {formatTime(timeLeft)} left
      </div>

      {/* Button Controls */}
      <div className="flex space-x-4">
        <Button
          onClick={() => setIsActive(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition duration-300 focus:ring-2 focus:ring-emerald-300"
        >
          Start
        </Button>
        <Button
          onClick={handlePause}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition duration-300 focus:ring-2 focus:ring-amber-300"
        >
          Pause
        </Button>
        <Button
          onClick={handleResume}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 focus:ring-2 focus:ring-blue-300"
        >
          Resume
        </Button>
        <Button
          onClick={handleReset}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition duration-300 focus:ring-2 focus:ring-rose-300"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
