import { useBuilder } from "../context/BuilderContext";

export default function ModeSwitcher() {
  const { mode, setMode } = useBuilder();

  return (
    <div className="flex bg-[#0f0f11] rounded-xl p-1 border border-gray-800 w-fit mx-auto">
      <button
        onClick={() => setMode("upload")}
        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
          mode === "upload"
            ? "bg-indigo-600 text-white shadow-lg"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        UPLOAD SCREENSHOT
      </button>
      <button
        onClick={() => setMode("design")}
        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
          mode === "design"
            ? "bg-indigo-600 text-white shadow-lg"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        DESIGN BLOCKS
      </button>
    </div>
  );
}