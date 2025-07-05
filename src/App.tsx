import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EggTimer from "./components/EggTimer";
import Menu from "./components/Menu";
import { slugify } from "./utils/string";

export type EggMode = {
  name: string;
  time: number;
  image: string;
};

export const EGG_MODES: EggMode[] = [
  { name: "Soft", time: 3 * 60, image: "/assets/images/soft.jpg" },
  { name: "Medium", time: 5 * 60, image: "/assets/images/medium.jpg" },
  { name: "Hard", time: 7 * 60, image: "/assets/images/hard.jpg" },
  {
    name: "Extra Hard",
    time: 10 * 60,
    image: "/assets/images/extra-hard.jpg",
  },
];

function App() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<EggMode | null>(null);

  // Sync URL parameter with selected mode
  useEffect(() => {
    if (mode) {
      const foundMode = EGG_MODES.find(
        (eggMode) => slugify(eggMode.name) === mode
      );
      if (foundMode) {
        setSelectedMode(foundMode);
      } else {
        // Invalid mode in URL, redirect to home
        navigate("/", { replace: true });
      }
    } else {
      setSelectedMode(null);
    }
  }, [mode, navigate]);

  const onModeSelect = (eggMode: EggMode) => {
    setSelectedMode(eggMode);
    navigate(`/${slugify(eggMode.name)}`);
  };

  const onCancel = () => {
    setSelectedMode(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {selectedMode ? (
          <EggTimer mode={selectedMode} onCancel={onCancel} />
        ) : (
          <Menu onSelectMode={onModeSelect} />
        )}
      </div>
    </div>
  );
}

export default App;
