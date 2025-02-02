import { useState } from "react";
import Menu from "./components/Menu";
import EggTimer from "./components/EggTimer";

export type EggMode = {
  name: string;
  time: number;
  image: string;
};

export const EGG_MODES: EggMode[] = [
  { name: "Soft", time: 3 * 60, image: "/src/assets/images/soft.jpg" },
  { name: "Medium", time: 5 * 60, image: "/src/assets/images/medium.jpg" },
  { name: "Hard", time: 7 * 60, image: "/src/assets/images/hard.jpg" },
  {
    name: "Extra Hard",
    time: 10 * 60,
    image: "/src/assets/images/extra-hard.jpg",
  },
];

function App() {
  const [selectedMode, setSelectedMode] = useState<EggMode | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {selectedMode ? (
          <EggTimer
            mode={selectedMode}
            onCancel={() => setSelectedMode(null)}
          />
        ) : (
          <Menu onSelectMode={setSelectedMode} />
        )}
      </div>
    </div>
  );
}

export default App;
