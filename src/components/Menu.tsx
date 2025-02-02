import { motion } from "framer-motion";
import { EGG_MODES } from "../App";
import type { EggMode } from "../App";

type MenuProps = {
  onSelectMode: (mode: EggMode) => void;
};

function Menu({ onSelectMode }: MenuProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Egg Timer</h1>
      <div className="grid grid-cols-2 gap-4">
        {EGG_MODES.map((mode) => (
          <motion.button
            key={mode.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100"
            onClick={() => onSelectMode(mode)}
          >
            <img
              src={mode.image}
              alt={mode.name}
              className="w-24 h-24 rounded-full mb-2 object-cover"
            />
            <span className="font-medium">{mode.name}</span>
            <span className="text-sm text-gray-500">
              {Math.floor(mode.time / 60)} mins
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default Menu;
