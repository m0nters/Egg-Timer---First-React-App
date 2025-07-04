import { Timer, X } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import type { EggMode } from "../App";

type TimerProps = {
  mode: EggMode;
  onCancel: () => void;
};

function EggTimer({ mode, onCancel }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(mode.time);

  // Alarm sound
  const [playAlarm, { stop }] = useSound("/assets/sounds/timer-done.wav", {
    loop: true,
  });

  // Ticking sound
  const [playTick] = useSound("/assets/sounds/tick.mp3", {
    volume: 0.5,
  });

  useEffect(() => {
    let interval: number;

    if (timeLeft > 0) {
      playTick();
      interval = setTimeout(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playAlarm();
    }

    // Cleanup function
    return () => {
      clearTimeout(interval);
    };
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSnooze = () => {
    stop();
    setTimeLeft(60);
  };

  const handleStop = () => {
    stop();
    onCancel();
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{mode.name}</h2>
        <button
          onClick={handleStop}
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>
      <motion.div
        animate={{
          rotate: timeLeft > 0 ? 360 : [-15, 15],
          scale: timeLeft === 0 ? [1, 1.1] : 1,
        }}
        transition={{
          rotate: {
            duration: timeLeft > 0 ? 1 : 0.3,
            repeat: timeLeft > 0 ? Infinity : Infinity,
            ease: timeLeft > 0 ? "backInOut" : "easeInOut",
            repeatType: timeLeft === 0 ? "reverse" : undefined,
          },
          scale: {
            duration: 0.5,
            repeat: timeLeft === 0 ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
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
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            Snooze
          </button>
          <button
            onClick={handleStop}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
          >
            Stop
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default EggTimer;
