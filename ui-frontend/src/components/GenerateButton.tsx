import { useState } from "react";
import { useBuilder } from "../context/BuilderContext";
import {
  generateImagePreview,
  generateImageZip,
  generateDesignPreview,
  generateDesignZip
} from "../api/client";

export default function GenerateButton() {
  const {
    mode,
    selectedImage,
    blocks,
    setGeneratedHtml
  } = useBuilder();

  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleGenerate = async () => {
    setLoading(true);
    setDownloadUrl("");

    try {
      if (mode === "upload" && selectedImage) {
        const html = await generateImagePreview(selectedImage);
        setGeneratedHtml(html);

        const blob = await generateImageZip(selectedImage);
        setDownloadUrl(URL.createObjectURL(blob));
      } else if (mode === "design") {
        const html = await generateDesignPreview(blocks);
        setGeneratedHtml(html);

        const blob = await generateDesignZip(blocks);
        setDownloadUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate web app. Check console for details.");
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={handleGenerate} disabled={loading || (!selectedImage && mode === "upload")}>
        {loading ? "Generating..." : "Generate Web App"}
      </button>

      {downloadUrl && (
        <div style={{ marginTop: 10 }}>
          <a href={downloadUrl} download="generated-webapp.zip">
            Download ZIP
          </a>
        </div>
      )}
    </div>
  );
}