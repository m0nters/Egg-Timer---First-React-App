import { Pause, Play, Timer, X } from "@phosphor-icons/react";
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
  const [isRunning, setIsRunning] = useState(false); // for pause button

  // Alarm sound
  const [playAlarm, { stop: stopAlarm }] = useSound(
    "/assets/sounds/timer-done.wav",
    {
      loop: true,
    }
  );

  // Ticking sound
  const [playTick] = useSound("/assets/sounds/tick.mp3", {
    volume: 0.5,
  });

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      playTick();
      interval = setTimeout(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playAlarm();
      setIsRunning(false);
    }

    // Cleanup function
    return () => {
      clearTimeout(interval);
    };
  }, [timeLeft, isRunning, playTick, playAlarm]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleSnooze = () => {
    stopAlarm();
    setTimeLeft(60);
    setIsRunning(true); // I think the snooze should be immediate
  };

  const handleStop = () => {
    stopAlarm();
    setTimeLeft(mode.time);
    setIsRunning(false);
  };

  const handleCancel = () => {
    stopAlarm();
    onCancel();
  };

  const getTimerAnimation = () => {
    // Time is up state
    if (timeLeft === 0) {
      return {
        rotate: [-15, 15],
        scale: [0.9, 1.1],
      };
    }

    // Running state
    if (isRunning && timeLeft > 0) {
      return {
        rotate: 360,
        scale: 1,
      };
    }

    // Paused state
    return {
      rotate: 0,
      scale: 1,
    };
  };

  const getTimerTransition = () => {
    // Time is up state
    if (timeLeft === 0) {
      return {
        rotate: {
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse" as const,
        },
        scale: {
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
      };
    }

    // Running state
    if (isRunning && timeLeft > 0) {
      return {
        rotate: {
          duration: 1,
          repeat: Infinity,
          ease: "backInOut",
        },
        scale: {
          duration: 0,
        },
      };
    }

    // Paused state
    return {
      rotate: {
        duration: 0,
      },
      scale: {
        duration: 0,
      },
    };
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
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>
      <motion.div
        animate={getTimerAnimation()}
        transition={getTimerTransition()}
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

      {timeLeft === 0 ? (
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
      ) : (
        <div className="flex justify-center">
          <button
            onClick={handleStartPause}
            className={`flex items-center gap-2 ${
              isRunning
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-6 py-2 rounded-lg cursor-pointer`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default EggTimer;
