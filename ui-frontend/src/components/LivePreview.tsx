import { useBuilder } from "../context/BuilderContext";

export default function LivePreview() {
  const { generatedHtml } = useBuilder();

  if (!generatedHtml) return null;

  return (
    <iframe
      srcDoc={generatedHtml}
      style={{ width: "100%", height: "400px", marginTop: 20, border: "1px solid #ccc" }}
      title="Live Preview"
    />
  );
}