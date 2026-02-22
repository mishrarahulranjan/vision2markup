import { useBuilder } from "../context/BuilderContext";

export default function ModeSwitcher() {
  const { mode, setMode } = useBuilder();

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setMode("upload")}
        disabled={mode === "upload"}
      >
        Upload Image
      </button>
      <button
        onClick={() => setMode("design")}
        disabled={mode === "design"}
        style={{ marginLeft: 10 }}
      >
        Design Builder
      </button>
    </div>
  );
}