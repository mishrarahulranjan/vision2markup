import { useBuilder } from "../context/BuilderContext";

export default function DesignCanvas() {
  const { blocks, updateBlock } = useBuilder();

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, minHeight: 300 }}>
      {blocks.map(block => (
        <div key={block.id} style={{ marginBottom: 12 }}>
          <textarea
            value={block.content}
            onChange={e => updateBlock(block.id, e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
}