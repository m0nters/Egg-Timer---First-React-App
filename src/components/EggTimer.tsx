import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import { Timer, X } from "@phosphor-icons/react";
import type { EggMode } from "../App";

type TimerProps = {
  mode: EggMode;
  onCancel: () => void;
};

function EggTimer({ mode, onCancel }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(mode.time);
  const [isActive, setIsActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { stop }] = useSound("/src/assets/sounds/timer-done.wav", {
    loop: true,
  });

  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      play();
      setIsPlaying(true);
    }

    return () => {
      clearInterval(interval);
      if (isPlaying) stop();
    };
  }, [isActive, timeLeft, play, stop, isPlaying]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSnooze = () => {
    stop();
    setIsPlaying(false);
    setTimeLeft(60);
    setIsActive(true);
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    onCancel();
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{mode.name}</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>
      </div>
      <motion.div
        animate={{
          rotate: isActive ? 360 : [-10, 10],
          scale: timeLeft === 0 ? [1, 1.1] : 1,
        }}
        transition={{
          rotate: {
            duration: isActive ? 2 : 0.2,
            repeat: Infinity,
            ease: isActive ? "linear" : "easeInOut",
            repeatType: isActive ? "loop" : "reverse",
          },
          scale: {
            duration: 0.3,
            repeat: timeLeft === 0 ? Infinity : 0,
            repeatType: "reverse",
          },
        }}
        className="w-48 h-48 mx-auto mb-6"
      >
        <Timer
          size={192}
          weight="duotone"
          className={timeLeft === 0 ? "text-red-500" : "text-gray-700"}
        />
      </motion.div>
      <div className="text-4xl font-bold text-center mb-6">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      {timeLeft === 0 && (
        <div className="flex gap-4">
          <button
            onClick={handleSnooze}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Snooze
          </button>
          <button
            onClick={handleStop}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Stop
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default EggTimer;
