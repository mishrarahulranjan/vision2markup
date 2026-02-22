import { useBuilder } from "../context/BuilderContext";

export default function Toolbar() {
  const { addBlock } = useBuilder();

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => addBlock("header")}>Add Header</button>
      <button onClick={() => addBlock("text")}>Add Text</button>
      <button onClick={() => addBlock("button")}>Add Button</button>
    </div>
  );
}